import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './accordion.css';

/* ---------------------------------------------------------------------------
 * Accordion — dependency-free, accessible, composable.
 * Copy this folder into your project and own the code.
 * ------------------------------------------------------------------------- */

const AccordionContext = createContext(null);
const AccordionItemContext = createContext(null);

const cx = (...classes) => classes.filter(Boolean).join(' ');
const toArray = (value) => (value == null ? [] : Array.isArray(value) ? value : [value]).map(String);
const toDomId = (value) => String(value).replace(/[^A-Za-z0-9_-]/g, '_');
const getItemValue = (item, index) => String(item.value ?? item.id ?? index);

// `hidden="until-found"` lets the browser's find-in-page (Ctrl+F) search
// collapsed content and fire `beforematch` so we can open the item.
const supportsUntilFound = () =>
  typeof HTMLElement !== 'undefined' && 'onbeforematch' in HTMLElement.prototype;

function useAccordionContext(component) {
  const context = useContext(AccordionContext);
  if (!context) throw new Error(`<${component}> must be rendered inside <Accordion>.`);
  return context;
}

function useAccordionItemContext(component) {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error(`<${component}> must be rendered inside <AccordionItem>.`);
  return context;
}

/* ----------------------------------- Icons ---------------------------------- */

function ArrowIcon() {
  return (
    <svg className="accordion__svg accordion__svg--arrow" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="accordion__svg accordion__svg--plus" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" focusable="false">
      <path d="M5 12h14" />
      <path className="accordion__svg-vertical" d="M12 5v14" />
    </svg>
  );
}

const ICONS = { arrow: ArrowIcon, plus: PlusIcon };

/* ------------------------------ FAQ structured data ------------------------- */

function FaqSchema({ items }) {
  const entities = items
    .filter((item) => typeof (item.title ?? item.question) === 'string')
    .map((item) => {
      const text = item.schemaText ?? item.content ?? item.answer;
      return typeof text === 'string'
        ? {
            '@type': 'Question',
            name: item.title ?? item.question,
            acceptedAnswer: { '@type': 'Answer', text },
          }
        : null;
    })
    .filter(Boolean);

  if (!entities.length) return null;
  const json = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entities,
  }).replace(/</g, '\\u003c');

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/* --------------------------------- Accordion -------------------------------- */

export function Accordion({
  items,
  count,
  children,
  multiple = false,
  collapsible = true,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  variant = 'border',
  size = 'md',
  radius = 'md',
  accentColor,
  iconType = 'arrow',
  iconPosition = 'end',
  icon,
  headingLevel = 'h3',
  showCloseAll = false,
  showExpandAll = false,
  closeAllLabel = 'Close all',
  expandAllLabel = 'Expand all',
  animated = true,
  duration = 250,
  searchable = true,
  lazyMount = false,
  deepLink = false,
  deepLinkPrefix = '',
  printExpanded = true,
  faqSchema = false,
  dir,
  className,
  classNames = {},
  style,
  ...rest
}) {
  const baseId = `accordion${useId().replace(/:/g, '')}`;
  const listRef = useRef(null);

  // Controlled / uncontrolled state. Values are kept in the order they were
  // opened so switching to single mode can keep the most recent one.
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(() => toArray(defaultValue));
  const openValues = isControlled ? toArray(valueProp) : internalValue;
  const openValuesRef = useRef(openValues);
  openValuesRef.current = openValues;

  const setOpenValues = useCallback(
    (next) => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(multiple ? next : next[next.length - 1] ?? null);
    },
    [isControlled, multiple, onValueChange]
  );

  // Open an item without toggling (used by find-in-page and deep links).
  const open = useCallback(
    (itemValue) => {
      const current = openValuesRef.current;
      if (current.includes(itemValue)) return;
      setOpenValues(multiple ? [...current, itemValue] : [itemValue]);
    },
    [multiple, setOpenValues]
  );

  const toggle = useCallback(
    (itemValue) => {
      const current = openValuesRef.current;
      const isOpen = current.includes(itemValue);
      if (isOpen && !multiple && !collapsible) return;
      setOpenValues(
        isOpen ? current.filter((v) => v !== itemValue) : multiple ? [...current, itemValue] : [itemValue]
      );

      if (deepLink) {
        const hash = `#${deepLinkPrefix}${itemValue}`;
        const { pathname, search } = window.location;
        if (!isOpen) window.history.replaceState(window.history.state, '', hash);
        else if (window.location.hash === hash) window.history.replaceState(window.history.state, '', pathname + search);
      }
    },
    [multiple, collapsible, setOpenValues, deepLink, deepLinkPrefix]
  );

  // Switching to single mode keeps only the most recently opened item.
  useEffect(() => {
    const current = openValuesRef.current;
    if (!multiple && current.length > 1) setOpenValues(current.slice(-1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiple]);

  const visibleItems = useMemo(
    () => (items ? items.slice(0, count ?? items.length) : null),
    [items, count]
  );

  // Data-driven mode: forget open state of items that are no longer rendered.
  const visibleKey = visibleItems?.map(getItemValue).join('\u0000');
  useEffect(() => {
    if (!visibleItems) return;
    const visible = new Set(visibleItems.map(getItemValue));
    const current = openValuesRef.current;
    const next = current.filter((v) => visible.has(v));
    if (next.length !== current.length) setOpenValues(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleKey]);

  // Triggers belonging to this accordion (ignores nested accordions).
  const getTriggers = useCallback(
    () =>
      [...(listRef.current?.querySelectorAll('[data-accordion-trigger]') ?? [])].filter(
        (el) => el.closest('[data-accordion-list]') === listRef.current
      ),
    []
  );

  // Deep links: "#<prefix><value>" opens that item and scrolls to it.
  useEffect(() => {
    if (!deepLink) return undefined;
    const openFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (!hash || !hash.startsWith(deepLinkPrefix)) return;
      const target = hash.slice(deepLinkPrefix.length);
      const trigger = getTriggers().find((el) => el.dataset.value === target && !el.disabled);
      if (!trigger) return;
      open(target);
      requestAnimationFrame(() => {
        trigger.closest('.accordion__item')?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        trigger.focus({ preventScroll: true });
      });
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [deepLink, deepLinkPrefix, getTriggers, open]);

  const expandAll = () => {
    const enabled = getTriggers()
      .filter((el) => !el.disabled)
      .map((el) => el.dataset.value);
    const current = openValuesRef.current;
    setOpenValues([...current, ...enabled.filter((v) => !current.includes(v))]);
  };

  const closeAll = () => setOpenValues([]);

  const handleKeyDown = (event) => {
    const triggers = getTriggers().filter((el) => !el.disabled);
    const index = triggers.indexOf(document.activeElement);
    if (index === -1) return;

    const targets = {
      ArrowDown: (index + 1) % triggers.length,
      ArrowUp: (index - 1 + triggers.length) % triggers.length,
      Home: 0,
      End: triggers.length - 1,
    };
    if (!(event.key in targets)) return;
    event.preventDefault();
    triggers[targets[event.key]].focus();
  };

  const context = {
    baseId,
    openValues,
    open,
    toggle,
    multiple,
    collapsible,
    disabled,
    iconType,
    iconPosition,
    icon,
    headingLevel,
    classNames,
    searchable,
    lazyMount,
    deepLink,
    deepLinkPrefix,
    closeDelay: animated ? duration : 0,
  };

  const rootStyle = {
    '--accordion-duration': `${duration}ms`,
    ...(accentColor ? { '--accordion-accent': accentColor } : null),
    ...style,
  };

  const showExpand = multiple && showExpandAll;
  const hasToolbar = showCloseAll || showExpand;

  return (
    <AccordionContext.Provider value={context}>
      <div
        {...rest}
        dir={dir}
        className={cx('accordion', classNames.root, className)}
        style={rootStyle}
        data-variant={variant}
        data-size={size}
        data-radius={radius}
        data-animated={animated ? 'true' : 'false'}
        data-print-expanded={printExpanded ? 'true' : 'false'}
        data-disabled={disabled || undefined}
      >
        {faqSchema && visibleItems && <FaqSchema items={visibleItems} />}
        {hasToolbar && (
          <div className={cx('accordion__toolbar', classNames.toolbar)}>
            {showExpand && (
              <button type="button" className="accordion__action" onClick={expandAll} disabled={disabled}>
                {expandAllLabel}
              </button>
            )}
            {showCloseAll && (
              <button
                type="button"
                className="accordion__action"
                onClick={closeAll}
                disabled={disabled || openValues.length === 0}
              >
                {closeAllLabel}
              </button>
            )}
          </div>
        )}
        <div
          ref={listRef}
          className={cx('accordion__list', classNames.list)}
          data-accordion-list=""
          onKeyDown={handleKeyDown}
        >
          {visibleItems
            ? visibleItems.map((item, index) => (
                <AccordionItem key={getItemValue(item, index)} value={getItemValue(item, index)} disabled={item.disabled}>
                  <AccordionTrigger>{item.title ?? item.question}</AccordionTrigger>
                  <AccordionContent>{item.content ?? item.answer}</AccordionContent>
                </AccordionItem>
              ))
            : children}
        </div>
      </div>
    </AccordionContext.Provider>
  );
}

/* ------------------------------- AccordionItem ------------------------------ */

export function AccordionItem({ value, disabled = false, className, children, ...rest }) {
  const context = useAccordionContext('AccordionItem');
  const autoValue = useId();
  const itemValue = value != null ? String(value) : autoValue;
  const isOpen = context.openValues.includes(itemValue);
  const isDisabled = context.disabled || disabled;
  const domId = toDomId(itemValue);

  const itemContext = {
    value: itemValue,
    isOpen,
    isDisabled,
    state: isOpen ? 'open' : 'closed',
    triggerId: `${context.baseId}-trigger-${domId}`,
    contentId: `${context.baseId}-content-${domId}`,
  };

  return (
    <AccordionItemContext.Provider value={itemContext}>
      <div
        id={context.deepLink ? `${context.deepLinkPrefix}${itemValue}` : undefined}
        {...rest}
        className={cx('accordion__item', context.classNames.item, className)}
        data-state={itemContext.state}
        data-disabled={isDisabled || undefined}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

/* ----------------------------- AccordionTrigger ----------------------------- */

export function AccordionTrigger({ children, className, headingLevel, icon, onClick, ...rest }) {
  const context = useAccordionContext('AccordionTrigger');
  const item = useAccordionItemContext('AccordionTrigger');
  const Heading = headingLevel ?? context.headingLevel;
  const DefaultIcon = ICONS[context.iconType];
  const iconNode = icon ?? context.icon ?? (DefaultIcon ? <DefaultIcon /> : null);
  // In single, non-collapsible mode the open item cannot be closed by its trigger.
  const isLocked = item.isOpen && !context.multiple && !context.collapsible;

  const handleClick = (event) => {
    onClick?.(event);
    if (!event.defaultPrevented) context.toggle(item.value);
  };

  return (
    <Heading className={cx('accordion__heading', context.classNames.heading)}>
      <button
        {...rest}
        type="button"
        id={item.triggerId}
        className={cx('accordion__trigger', context.classNames.trigger, className)}
        aria-expanded={item.isOpen}
        aria-controls={item.contentId}
        aria-disabled={isLocked || undefined}
        disabled={item.isDisabled}
        data-state={item.state}
        data-icon-position={context.iconPosition}
        data-accordion-trigger=""
        data-value={item.value}
        onClick={handleClick}
      >
        <span className="accordion__title">{children}</span>
        {iconNode && (
          <span className={cx('accordion__icon', context.classNames.icon)} aria-hidden="true">
            {iconNode}
          </span>
        )}
      </button>
    </Heading>
  );
}

/* ----------------------------- AccordionContent ----------------------------- */

export function AccordionContent({ children, className, ...rest }) {
  const context = useAccordionContext('AccordionContent');
  const item = useAccordionItemContext('AccordionContent');
  const bodyRef = useRef(null);
  const wasOpen = useRef(item.isOpen);
  const [hasOpened, setHasOpened] = useState(item.isOpen);
  if (item.isOpen && !hasOpened) setHasOpened(true);

  const untilFound = context.searchable && supportsUntilFound();
  const { open, closeDelay } = context;

  // Hide closed content with hidden="until-found" once the close animation ends.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return undefined;
    if (!untilFound || item.isOpen) {
      body.removeAttribute('hidden');
      wasOpen.current = item.isOpen;
      return undefined;
    }
    const delay = wasOpen.current ? closeDelay : 0;
    wasOpen.current = false;
    const timer = setTimeout(() => body.setAttribute('hidden', 'until-found'), delay);
    return () => clearTimeout(timer);
  }, [item.isOpen, untilFound, closeDelay]);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body || !untilFound) return undefined;
    const onBeforeMatch = () => open(item.value);
    body.addEventListener('beforematch', onBeforeMatch);
    return () => body.removeEventListener('beforematch', onBeforeMatch);
  }, [untilFound, open, item.value]);

  const shouldRender = !context.lazyMount || hasOpened;

  return (
    <div
      {...rest}
      id={item.contentId}
      role="region"
      aria-labelledby={item.triggerId}
      className={cx('accordion__content', context.classNames.content, className)}
      data-state={item.state}
      {...(item.isOpen || untilFound ? null : { inert: '' })}
    >
      <div className="accordion__content-inner">
        <div ref={bodyRef} className="accordion__content-body">
          {shouldRender ? children : null}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
