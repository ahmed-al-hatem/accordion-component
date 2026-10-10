# Accordion Component

An accessible, themeable, dependency-free React accordion — plus a live playground and docs site.

Built on the "copy, paste, own" idea popularized by shadcn/ui, without using shadcn/ui or Tailwind: the component is a single folder you copy into your project and edit freely.

## Run the project

```bash
npm install
npm run dev      # playground + docs at http://localhost:5173
npm test         # run the component test suite (Vitest)
npm run build    # production build in dist/
```

- **Playground** — `#/`: tweak every prop from the sidebar, see the live JSX, and share the configuration with **Copy link** (settings live in the URL query).
- **Docs** — `#/docs`: installation, usage, composition, controlled mode, examples, features, styling and the full API reference.

## Use the component in your project

1. Copy `src/components/accordion/` into your project. You need `Accordion.jsx`, `accordion.css` and `index.js`; `Accordion.test.jsx` is optional.
2. Import it. The stylesheet is imported by the component.

```jsx
import { Accordion } from './components/accordion';

const items = [
  { value: 'shipping', title: 'How long does shipping take?', content: 'Orders ship within 2–3 business days.' },
  { value: 'returns', title: 'What is your return policy?', content: 'Return any unused item within 30 days.' },
];

export default function Faq() {
  return <Accordion items={items} defaultValue="shipping" />;
}
```

Or compose the parts yourself:

```jsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/accordion';

<Accordion variant="separated" multiple>
  <AccordionItem value="account">
    <AccordionTrigger>Account settings</AccordionTrigger>
    <AccordionContent>Update your name, email address and password.</AccordionContent>
  </AccordionItem>
</Accordion>;
```

Requirements: React 18+. No other dependencies.

## Highlights

- **Two APIs** — data-driven `items` or composable `AccordionItem` / `AccordionTrigger` / `AccordionContent`.
- **Controlled or uncontrolled** — `value` / `defaultValue` / `onValueChange`, single or `multiple`, `collapsible`.
- **Theming** — `variant`, `size`, `radius`, `accentColor`, `--accordion-*` CSS variables, `className` / `classNames` slots, `data-state` attributes, built-in dark palette.
- **Accessibility** — WAI-ARIA accordion pattern, full keyboard support (Enter, Space, ↑ ↓ Home End), RTL, reduced motion.
- **Find in page** — closed content uses `hidden="until-found"`, so Ctrl+F finds it and opens the item.
- **Deep links** — `deepLink` + `deepLinkPrefix` make every answer linkable (`#faq-returns`).
- **Lazy mount, print and SEO** — `lazyMount`, `printExpanded`, and `faqSchema` (schema.org FAQPage JSON-LD).

See the Docs page for the complete prop tables.

## Project structure

```
src/
├─ components/
│  ├─ accordion/          # the reusable component (copy this)
│  ├─ CodeBlock.jsx       # highlighted code with copy button
│  ├─ CodeBox.jsx         # live JSX for the playground
│  ├─ Icons.jsx
│  ├─ Navbar.jsx
│  └─ Sidebar.jsx         # playground controls
├─ data/                  # FAQ content, API reference, playground options
├─ lib/                   # hash router, theme hook, syntax highlighter
├─ pages/                 # Playground and Docs
├─ test/setup.js
├─ App.jsx
├─ main.jsx
└─ styles.css             # site styles (not needed by the component)
```
