import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  JSX,
  ReactNode,
} from 'react';

export type AccordionVariant = 'default' | 'border' | 'bold' | 'bg' | 'separated';
export type AccordionSize = 'sm' | 'md' | 'lg';
export type AccordionRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';
export type AccordionIconType = 'arrow' | 'plus' | 'none';
export type AccordionIconPosition = 'start' | 'end';
export type AccordionHeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type AccordionSlot =
  | 'root'
  | 'toolbar'
  | 'list'
  | 'item'
  | 'heading'
  | 'trigger'
  | 'icon'
  | 'content';

/** One entry of the `items` array (data-driven mode). */
export interface AccordionItemData {
  /** Unique identifier. Falls back to `id`, then the index. */
  value?: string;
  id?: string;
  /** Trigger label. */
  title?: ReactNode;
  /** Alias of `title`. */
  question?: ReactNode;
  /** Panel content. */
  content?: ReactNode;
  /** Alias of `content`. */
  answer?: ReactNode;
  /** Disable this item. */
  disabled?: boolean;
  /** Plain-text answer for `faqSchema` when `content` is JSX. */
  schemaText?: string;
}

interface AccordionBaseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'dir' | 'children'> {
  /** Data-driven mode. When provided, `children` are ignored. */
  items?: AccordionItemData[];
  /** How many entries of `items` to render. Defaults to all. */
  count?: number;
  /** Composition mode: `<AccordionItem>` elements. */
  children?: ReactNode;
  /** Single mode only: allow closing the open item. @default true */
  collapsible?: boolean;
  /** Disable every item. @default false */
  disabled?: boolean;
  /** @default 'border' */
  variant?: AccordionVariant;
  /** @default 'md' */
  size?: AccordionSize;
  /** @default 'md' */
  radius?: AccordionRadius;
  /** Any CSS color. Sets `--accordion-accent`. */
  accentColor?: string;
  /** @default 'arrow' */
  iconType?: AccordionIconType;
  /** @default 'end' */
  iconPosition?: AccordionIconPosition;
  /** Custom icon for every trigger. Overrides `iconType`. */
  icon?: ReactNode;
  /** Heading element wrapping each trigger. @default 'h3' */
  headingLevel?: AccordionHeadingLevel;
  /** Show a “Close all” button. @default false */
  showCloseAll?: boolean;
  /** Show an “Expand all” button (multiple mode only). @default false */
  showExpandAll?: boolean;
  /** @default 'Close all' */
  closeAllLabel?: string;
  /** @default 'Expand all' */
  expandAllLabel?: string;
  /** Toggle all transitions. @default true */
  animated?: boolean;
  /** Transition duration in ms. @default 250 */
  duration?: number;
  /** Ctrl+F finds text in closed items via hidden="until-found". @default true */
  searchable?: boolean;
  /** Render content only after an item is first opened. @default false */
  lazyMount?: boolean;
  /** Sync the open item with the URL hash `#<prefix><value>`. @default false */
  deepLink?: boolean;
  /** Prefix for deep-link hashes and item ids. @default '' */
  deepLinkPrefix?: string;
  /** Show every item's content when printing. @default true */
  printExpanded?: boolean;
  /** Output schema.org FAQPage JSON-LD (data-driven mode). @default false */
  faqSchema?: boolean;
  /** Text direction. Inherited when omitted. */
  dir?: 'ltr' | 'rtl';
  /** Extra classes per slot. */
  classNames?: Partial<Record<AccordionSlot, string>>;
  style?: CSSProperties;
}

export interface AccordionSingleProps extends AccordionBaseProps {
  /** Allow several items to be open at once. @default false */
  multiple?: false;
  /** Controlled open value. */
  value?: string | null;
  /** Initially open value when uncontrolled. */
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
}

export interface AccordionMultipleProps extends AccordionBaseProps {
  multiple: true;
  /** Controlled open values. */
  value?: string[];
  /** Initially open values when uncontrolled. */
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Unique identifier used by `value` / `defaultValue`. Auto-generated when omitted. */
  value?: string;
  /** Disable this item only. */
  disabled?: boolean;
}

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Override the heading level for this item. */
  headingLevel?: AccordionHeadingLevel;
  /** Override the icon for this item. */
  icon?: ReactNode;
}

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

export declare function Accordion(props: AccordionProps): JSX.Element;
export declare function AccordionItem(props: AccordionItemProps): JSX.Element;
export declare function AccordionTrigger(props: AccordionTriggerProps): JSX.Element;
export declare function AccordionContent(props: AccordionContentProps): JSX.Element;

export default Accordion;
