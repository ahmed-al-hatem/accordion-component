export const accordionProps = [
  { name: 'items', type: 'AccordionItemData[]', default: '—', description: 'Data-driven mode. When provided, children are ignored.' },
  { name: 'count', type: 'number', default: 'items.length', description: 'How many entries of items to render.' },
  { name: 'children', type: 'ReactNode', default: '—', description: 'Composition mode: <AccordionItem> elements.' },
  { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow several items to be open at once. Switching it off keeps only the last opened item.' },
  { name: 'collapsible', type: 'boolean', default: 'true', description: 'Single mode only: allow closing the currently open item.' },
  { name: 'value', type: 'string | string[] | null', default: '—', description: 'Controlled open value(s). Use with onValueChange.' },
  { name: 'defaultValue', type: 'string | string[]', default: '—', description: 'Initially open value(s) when uncontrolled.' },
  { name: 'onValueChange', type: '(value) => void', default: '—', description: 'Called with string | null in single mode, string[] in multiple mode.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable every item.' },
  { name: 'variant', type: "'default' | 'border' | 'bold' | 'bg' | 'separated'", default: "'border'", description: 'Visual style.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding and font size.' },
  { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Corner radius of items and the frame.' },
  { name: 'accentColor', type: 'string', default: "'#4f46e5'", description: 'Any CSS color. Sets --accordion-accent.' },
  { name: 'iconType', type: "'arrow' | 'plus' | 'none'", default: "'arrow'", description: 'Built-in indicator icon. Arrow rotates, plus morphs into minus.' },
  { name: 'iconPosition', type: "'start' | 'end'", default: "'end'", description: 'Icon placement inside the trigger.' },
  { name: 'icon', type: 'ReactNode', default: '—', description: 'Custom icon for every trigger. Overrides iconType.' },
  { name: 'headingLevel', type: "'h2' | 'h3' | 'h4' | 'h5' | 'h6'", default: "'h3'", description: 'Heading element wrapping each trigger.' },
  { name: 'showCloseAll', type: 'boolean', default: 'false', description: 'Show a “Close all” button above the list.' },
  { name: 'showExpandAll', type: 'boolean', default: 'false', description: 'Show an “Expand all” button (multiple mode only).' },
  { name: 'closeAllLabel', type: 'string', default: "'Close all'", description: 'Label for the close-all button (i18n).' },
  { name: 'expandAllLabel', type: 'string', default: "'Expand all'", description: 'Label for the expand-all button (i18n).' },
  { name: 'animated', type: 'boolean', default: 'true', description: 'Toggle all transitions.' },
  { name: 'duration', type: 'number', default: '250', description: 'Transition duration in milliseconds.' },
  { name: 'searchable', type: 'boolean', default: 'true', description: 'Closed content uses hidden="until-found", so Ctrl+F finds it and opens the item. Falls back to inert where unsupported.' },
  { name: 'lazyMount', type: 'boolean', default: 'false', description: 'Render an item’s content only after it is opened for the first time.' },
  { name: 'deepLink', type: 'boolean', default: 'false', description: 'Sync the open item with the URL hash: #<prefix><value> opens and scrolls to it.' },
  { name: 'deepLinkPrefix', type: 'string', default: "''", description: 'Prefix for deep-link hashes and item ids, e.g. "faq-".' },
  { name: 'printExpanded', type: 'boolean', default: 'true', description: 'Show every item’s content when printing.' },
  { name: 'faqSchema', type: 'boolean', default: 'false', description: 'Data-driven mode: output schema.org FAQPage JSON-LD for search engines.' },
  { name: 'dir', type: "'ltr' | 'rtl'", default: 'inherited', description: 'Text direction. Layout uses logical properties.' },
  { name: 'className', type: 'string', default: '—', description: 'Extra class on the root element.' },
  { name: 'classNames', type: 'Partial<Record<Slot, string>>', default: '{}', description: 'Classes per slot: root, toolbar, list, item, heading, trigger, icon, content.' },
  { name: 'style', type: 'CSSProperties', default: '—', description: 'Inline styles on the root. Handy for CSS variables.' },
  { name: '...rest', type: 'HTMLAttributes<div>', default: '—', description: 'Any other attribute is spread onto the root <div>.' },
];

export const itemProps = [
  { name: 'value', type: 'string', default: 'auto', description: 'Unique identifier used by value / defaultValue.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable this item only.' },
  { name: 'className', type: 'string', default: '—', description: 'Extra class on the item.' },
  { name: '...rest', type: 'HTMLAttributes<div>', default: '—', description: 'Spread onto the item <div>.' },
];

export const triggerProps = [
  { name: 'children', type: 'ReactNode', default: '—', description: 'Trigger label.' },
  { name: 'headingLevel', type: "'h2' … 'h6'", default: 'from Accordion', description: 'Override the heading level for this item.' },
  { name: 'icon', type: 'ReactNode', default: 'from Accordion', description: 'Override the icon for this item.' },
  { name: 'className', type: 'string', default: '—', description: 'Extra class on the <button>.' },
  { name: '...rest', type: 'ButtonHTMLAttributes', default: '—', description: 'Spread onto the <button>. onClick can call event.preventDefault() to cancel toggling.' },
];

export const contentProps = [
  { name: 'children', type: 'ReactNode', default: '—', description: 'Panel content. Any markup is allowed.' },
  { name: 'className', type: 'string', default: '—', description: 'Extra class on the region.' },
  { name: '...rest', type: 'HTMLAttributes<div>', default: '—', description: 'Spread onto the region <div>.' },
];

export const itemDataShape = [
  { name: 'value', type: 'string', default: 'id ?? index', description: 'Unique identifier.' },
  { name: 'title', type: 'ReactNode', default: '—', description: 'Trigger label (alias: question).' },
  { name: 'content', type: 'ReactNode', default: '—', description: 'Panel content (alias: answer).' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable this item.' },
  { name: 'schemaText', type: 'string', default: '—', description: 'Plain-text answer for faqSchema when content is JSX.' },
];

export const cssVariables = [
  { name: '--accordion-accent', default: '#4f46e5', description: 'Accent for icons, hover, focus and open states.' },
  { name: '--accordion-accent-soft', default: 'accent 9% mix', description: 'Open background in the bg variant.' },
  { name: '--accordion-text', default: '#1b1e2b', description: 'Trigger text color.' },
  { name: '--accordion-muted', default: '#5d6275', description: 'Content text and idle icon color.' },
  { name: '--accordion-border', default: '#e3e5ec', description: 'Borders and dividers.' },
  { name: '--accordion-surface', default: '#ffffff', description: 'Card background (separated variant).' },
  { name: '--accordion-surface-muted', default: '#f3f4f8', description: 'Item background (bg variant).' },
  { name: '--accordion-radius', default: '10px', description: 'Corner radius (set by radius prop).' },
  { name: '--accordion-duration', default: '250ms', description: 'Transition duration (set by duration prop).' },
  { name: '--accordion-easing', default: 'ease', description: 'Transition timing function.' },
  { name: '--accordion-pad-block', default: '16px', description: 'Vertical padding (set by size prop).' },
  { name: '--accordion-pad-inline', default: '16px', description: 'Horizontal padding (set by size prop).' },
  { name: '--accordion-font-size', default: '1rem', description: 'Base font size (set by size prop).' },
  { name: '--accordion-gap', default: '8px', description: 'Spacing between cards and toolbar buttons.' },
  { name: '--accordion-scroll-margin', default: '0px', description: 'Offset when scrolling to a deep-linked item (e.g. sticky header height).' },
];

export const keyboard = [
  { key: 'Enter / Space', description: 'Toggle the focused item.' },
  { key: 'Tab / Shift+Tab', description: 'Move to the next / previous focusable element.' },
  { key: 'ArrowDown', description: 'Focus the next trigger (wraps to the first).' },
  { key: 'ArrowUp', description: 'Focus the previous trigger (wraps to the last).' },
  { key: 'Home', description: 'Focus the first trigger.' },
  { key: 'End', description: 'Focus the last trigger.' },
];
