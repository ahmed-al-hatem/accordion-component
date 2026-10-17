# react-accordion-kit

An accessible, themeable, dependency-free React accordion with composable parts, find-in-page, deep links and RTL support.

**[Live playground & docs →](https://ahmed-al-hatem.github.io/accordion-component/)**

## Install

```bash
npm install react-accordion-kit
```

```jsx
import { Accordion } from 'react-accordion-kit';
import 'react-accordion-kit/styles.css'; // once, e.g. in your app entry

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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'react-accordion-kit';

<Accordion variant="separated" multiple>
  <AccordionItem value="account">
    <AccordionTrigger>Account settings</AccordionTrigger>
    <AccordionContent>Update your name, email address and password.</AccordionContent>
  </AccordionItem>
</Accordion>;
```

Requirements: React 18+. No other dependencies. TypeScript types included; ESM and CommonJS builds; marked `"use client"` for the Next.js App Router.

### Prefer to own the code?

In the spirit of shadcn/ui, you can copy `src/components/accordion/` (`Accordion.jsx`, `accordion.css`, `index.js`) from this repository into your project and edit it freely. That version imports its stylesheet itself.

## Highlights

- **Two APIs** — data-driven `items` or composable `AccordionItem` / `AccordionTrigger` / `AccordionContent`.
- **Controlled or uncontrolled** — `value` / `defaultValue` / `onValueChange`, single or `multiple`, `collapsible`.
- **Theming** — `variant`, `size`, `radius`, `accentColor`, `--accordion-*` CSS variables, `className` / `classNames` slots, `data-state` attributes, built-in dark palette (opt-in via `.dark` or `[data-theme="dark"]`).
- **Accessibility** — WAI-ARIA accordion pattern, full keyboard support (Enter, Space, ↑ ↓ Home End), RTL, reduced motion.
- **Find in page** — closed content uses `hidden="until-found"`, so Ctrl+F finds it and opens the item.
- **Deep links** — `deepLink` + `deepLinkPrefix` make every answer linkable (`#faq-returns`).
- **Lazy mount, print and SEO** — `lazyMount`, `printExpanded`, and `faqSchema` (schema.org FAQPage JSON-LD).
- **SSR-safe** — renders on the server without warnings or hydration mismatches.

See the [docs](https://ahmed-al-hatem.github.io/accordion-component/#/docs/api) for the complete prop tables.

## Development

```bash
npm install
npm run dev         # playground + docs at http://localhost:5173
npm test            # component test suite (Vitest)
npm run build       # docs site → dist/
npm run build:lib   # npm package → lib/
```

- **Playground** — `#/`: tweak every prop, see the live JSX, share the configuration with **Copy link**.
- **Docs** — `#/docs`: installation, usage, composition, examples, features, styling and API reference.
- **Legacy** — `/legacy/`: the original vanilla HTML/JS version.

### Releasing

Pushing to `main` deploys the docs site to GitHub Pages. Publishing to npm happens from GitHub Actions when a version tag is pushed (requires the `NPM_TOKEN` repository secret):

```bash
npm version patch   # or minor / major — bumps package.json and creates the tag
git push --follow-tags
```

The workflow checks that the tag matches `package.json`, runs the tests, builds `lib/` and publishes with npm provenance.

## Project structure

```
src/
├─ components/
│  ├─ accordion/          # the reusable component (published to npm)
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
types/index.d.ts          # TypeScript definitions for the package
vite.config.js            # docs site build
vite.lib.config.js        # npm library build
```

## License

[MIT](LICENSE)
