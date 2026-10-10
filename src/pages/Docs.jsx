import { useEffect, useState } from 'react';
import CodeBlock from '../components/CodeBlock.jsx';
import { StarIcon } from '../components/Icons.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/accordion';
import {
  accordionProps,
  contentProps,
  cssVariables,
  itemDataShape,
  itemProps,
  keyboard,
  triggerProps,
} from '../data/accordionApi.js';

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'installation', label: 'Installation' },
  { id: 'usage', label: 'Usage' },
  { id: 'composition', label: 'Composition' },
  { id: 'controlled', label: 'Controlled' },
  { id: 'examples', label: 'Examples' },
  { id: 'features', label: 'Features' },
  { id: 'styling', label: 'Styling' },
  { id: 'api', label: 'API reference' },
  { id: 'accessibility', label: 'Accessibility' },
];

const demoItems = [
  { value: 'shipping', title: 'How long does shipping take?', content: 'Orders ship within 2–3 business days and arrive in about a week.' },
  { value: 'returns', title: 'What is your return policy?', content: 'You can return any unused item within 30 days for a full refund.' },
  { value: 'support', title: 'How do I contact support?', content: 'Email support@example.com or use the live chat. We reply within two hours.' },
];

const rtlItems = [
  { value: 'what', title: 'ما هو هذا المكوّن؟', content: 'مكوّن أكورديون قابل لإعادة الاستخدام ويدعم الاتجاه من اليمين إلى اليسار.' },
  { value: 'how', title: 'كيف أستخدمه؟', content: 'انسخ المجلد إلى مشروعك ومرّر الخاصية dir="rtl".' },
];

/* ------------------------------- Code samples ------------------------------- */

const CODE = {
  install: `src/
└─ components/
   └─ accordion/
      ├─ Accordion.jsx   // components + logic
      ├─ accordion.css   // standalone styles
      └─ index.js        // public exports`,

  import: `import { Accordion } from './components/accordion';`,

  usage: `import { Accordion } from './components/accordion';

const items = [
  { value: 'shipping', title: 'How long does shipping take?', content: 'Orders ship within 2–3 business days.' },
  { value: 'returns', title: 'What is your return policy?', content: 'Return any unused item within 30 days.' },
  { value: 'support', title: 'How do I contact support?', content: 'Email support@example.com.' },
];

export default function Faq() {
  return <Accordion items={items} defaultValue="shipping" />;
}`,

  composition: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion';

export default function Settings() {
  return (
    <Accordion variant="separated" multiple defaultValue={['account']}>
      <AccordionItem value="account">
        <AccordionTrigger>Account settings</AccordionTrigger>
        <AccordionContent>
          <p>Update your name, email address and password.</p>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="billing" disabled>
        <AccordionTrigger>Billing (coming soon)</AccordionTrigger>
        <AccordionContent>Billing settings will be available soon.</AccordionContent>
      </AccordionItem>

      <AccordionItem value="notifications">
        <AccordionTrigger>Notifications</AccordionTrigger>
        <AccordionContent>
          <ul>
            <li>Weekly email digest</li>
            <li>Push notifications</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,

  controlled: `import { useState } from 'react';
import { Accordion } from './components/accordion';

export default function ControlledFaq() {
  const [value, setValue] = useState('returns');

  return (
    <>
      <Accordion
        items={items}
        value={value}
        onValueChange={setValue}
        collapsible={false}
      />
      <p>Open item: {value}</p>
      <button onClick={() => setValue('support')}>Open “support”</button>
    </>
  );
}`,

  themed: `<Accordion
  items={items}
  variant="bg"
  size="lg"
  radius="lg"
  accentColor="#0d9488"
  iconType="plus"
  iconPosition="start"
/>`,

  rtl: `<Accordion
  dir="rtl"
  items={arabicItems}
  variant="bold"
  closeAllLabel="إغلاق الكل"
  showCloseAll
/>`,

  customIcon: `<Accordion
  items={items}
  variant="separated"
  icon={<StarIcon />}
  multiple
  showExpandAll
  showCloseAll
/>`,

  deepLink: `<Accordion items={items} deepLink deepLinkPrefix="faq-" />

// https://example.com/help#faq-returns  → opens “returns” and scrolls to it.
// Opening an item updates the hash, so users can copy a link to any answer.`,

  scrollMargin: `/* Keep deep-linked items clear of a sticky header */
.accordion {
  --accordion-scroll-margin: 80px;
}`,

  lazy: `<Accordion items={items} lazyMount />`,

  schema: `<Accordion
  items={[
    { value: 'returns', title: 'What is your return policy?', content: 'Return any item within 30 days.' },
    // JSX content? Provide plain text for search engines:
    { value: 'help', title: 'Need help?', content: <a href="/contact">Contact us</a>, schemaText: 'Use the contact page.' },
  ]}
  faqSchema
/>`,

  dark: `<!-- Light by default. Either of these turns on the dark palette -->
<html data-theme="dark">  …  </html>
<html class="dark">       …  </html>`,

  cssVars: `/* Theme every accordion inside .faq */
.faq .accordion {
  --accordion-accent: #e11d48;
  --accordion-border: #fecdd3;
  --accordion-radius: 16px;
  --accordion-easing: cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* Style by state with data attributes */
.faq .accordion__trigger[data-state='open'] {
  font-weight: 700;
}

.faq .accordion__item[data-disabled] {
  filter: grayscale(1);
}`,

  classNames: `<Accordion
  items={items}
  className="faq"
  classNames={{
    item: 'faq-item',
    trigger: 'faq-trigger',
    content: 'faq-content',
  }}
/>`,
};

/* ------------------------------- Helpers ------------------------------------ */

// The hash doesn't change when the current section's link is clicked again,
// so scroll manually in that case.
function scrollIfCurrent(id) {
  if (window.location.hash === `#/docs/${id}`) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function Section({ id, title, children }) {
  return (
    <section className="docs-section" id={id} aria-labelledby={`${id}-title`}>
      <h2 className="docs-section__title" id={`${id}-title`}>
        <a href={`#/docs/${id}`} onClick={() => scrollIfCurrent(id)} className="docs-anchor">
          {title}
        </a>
      </h2>
      {children}
    </section>
  );
}

function Demo({ code, children }) {
  return (
    <div className="demo">
      <div className="demo__preview">{children}</div>
      <CodeBlock code={code} />
    </div>
  );
}

function PropsTable({ rows, caption }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <caption className="table__caption">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td><code className="code-inline code-inline--accent">{row.name}</code></td>
              <td><code className="code-inline">{row.type}</code></td>
              <td><code className="code-inline">{row.default}</code></td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ControlledDemo() {
  const [value, setValue] = useState('returns');
  return (
    <div className="stack">
      <Accordion items={demoItems} value={value} onValueChange={setValue} collapsible={false} />
      <div className="demo__state">
        <span>
          Open item: <code className="code-inline code-inline--accent">{String(value)}</code>
        </span>
        <button type="button" className="btn btn--ghost" onClick={() => setValue('support')}>
          Open “support”
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------- Page ------------------------------------ */

export default function Docs({ section }) {
  const [active, setActive] = useState(section || SECTIONS[0].id);

  // Scroll to the section named in the URL (#/docs/<section>).
  useEffect(() => {
    if (section) {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [section]);

  // Highlight the section currently in view.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="docs">
      <nav className="docs__toc" aria-label="On this page">
        <p className="docs__toc-title">On this page</p>
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#/docs/${s.id}`}
                onClick={() => scrollIfCurrent(s.id)}
                className="docs__toc-link"
                aria-current={active === s.id ? 'true' : undefined}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="docs__content" id="main" tabIndex={-1}>
        <header className="docs__hero">
          <p className="docs__eyebrow">Components</p>
          <h1 className="docs__title">Accordion</h1>
          <p className="docs__lead">
            A vertically stacked set of interactive headings that each reveal a section of content.
            Accessible, themeable and dependency-free — copy it into your project and make it yours.
          </p>
        </header>

        <Section id="introduction" title="Introduction">
          <p>
            This component follows the <strong>“copy, paste, own”</strong> approach: it is not an npm package.
            You copy the source into your codebase, so you can read, change and extend every line.
          </p>
          <ul className="docs-list">
            <li><strong>Zero dependencies</strong> — only React 18+. No UI kit, no CSS framework, no icon library.</li>
            <li><strong>Two APIs</strong> — pass an <code className="code-inline">items</code> array, or compose <code className="code-inline">AccordionItem</code> / <code className="code-inline">AccordionTrigger</code> / <code className="code-inline">AccordionContent</code> yourself.</li>
            <li><strong>Themeable</strong> — props for common options, CSS variables for the theme, <code className="code-inline">className</code> / <code className="code-inline">classNames</code> and <code className="code-inline">data-state</code> attributes for everything else.</li>
            <li><strong>Accessible</strong> — WAI-ARIA accordion pattern with full keyboard support, RTL and reduced-motion support.</li>
          </ul>
        </Section>

        <Section id="installation" title="Installation">
          <ol className="docs-steps">
            <li>
              <p>Copy the <code className="code-inline">accordion</code> folder into your project:</p>
              <CodeBlock code={CODE.install} title="Files" />
            </li>
            <li>
              <p>Import it where you need it. The stylesheet is imported by the component automatically.</p>
              <CodeBlock code={CODE.import} />
            </li>
            <li>
              <p>That’s it. Adjust the code and styles freely — it’s yours now.</p>
            </li>
          </ol>
        </Section>

        <Section id="usage" title="Usage">
          <p>
            The quickest way is the data-driven API: pass an array of items with a <code className="code-inline">title</code> and{' '}
            <code className="code-inline">content</code>.
          </p>
          <Demo code={CODE.usage}>
            <Accordion items={demoItems} defaultValue="shipping" />
          </Demo>
        </Section>

        <Section id="composition" title="Composition">
          <p>
            For full control over markup, compose the parts yourself. Content can be any JSX, and every part accepts{' '}
            <code className="code-inline">className</code> and native HTML attributes.
          </p>
          <Demo code={CODE.composition}>
            <Accordion variant="separated" multiple defaultValue={['account']}>
              <AccordionItem value="account">
                <AccordionTrigger>Account settings</AccordionTrigger>
                <AccordionContent>
                  <p>Update your name, email address and password.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="billing" disabled>
                <AccordionTrigger>Billing (coming soon)</AccordionTrigger>
                <AccordionContent>Billing settings will be available soon.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="notifications">
                <AccordionTrigger>Notifications</AccordionTrigger>
                <AccordionContent>
                  <ul>
                    <li>Weekly email digest</li>
                    <li>Push notifications</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Demo>
        </Section>

        <Section id="controlled" title="Controlled">
          <p>
            Pass <code className="code-inline">value</code> and <code className="code-inline">onValueChange</code> to drive the open state
            from your own state. In single mode the value is a <code className="code-inline">string | null</code>; in multiple mode it is a{' '}
            <code className="code-inline">string[]</code>.
          </p>
          <Demo code={CODE.controlled}>
            <ControlledDemo />
          </Demo>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subtitle">Custom theme</h3>
          <Demo code={CODE.themed}>
            <Accordion items={demoItems} variant="bg" size="lg" radius="lg" accentColor="#0d9488" iconType="plus" iconPosition="start" />
          </Demo>

          <h3 className="docs-subtitle">Right-to-left</h3>
          <Demo code={CODE.rtl}>
            <Accordion dir="rtl" items={rtlItems} variant="bold" closeAllLabel="إغلاق الكل" showCloseAll />
          </Demo>

          <h3 className="docs-subtitle">Custom icon &amp; toolbar</h3>
          <Demo code={CODE.customIcon}>
            <Accordion items={demoItems} variant="separated" icon={<StarIcon />} multiple showExpandAll showCloseAll />
          </Demo>
        </Section>

        <Section id="features" title="Features">
          <h3 className="docs-subtitle">Find in page</h3>
          <p>
            With <code className="code-inline">searchable</code> (on by default), closed content is hidden with{' '}
            <code className="code-inline">hidden="until-found"</code>. Pressing <kbd className="kbd">Ctrl</kbd> + <kbd className="kbd">F</kbd>{' '}
            finds text inside closed items, and the matching item opens automatically. Browsers without support fall back to{' '}
            <code className="code-inline">inert</code>. Try it on this page: search for “two hours” or “push notifications”.
          </p>

          <h3 className="docs-subtitle">Deep links</h3>
          <p>
            Turn on <code className="code-inline">deepLink</code> to make every answer linkable. The item’s id becomes{' '}
            <code className="code-inline">{'<prefix><value>'}</code>.
          </p>
          <CodeBlock code={CODE.deepLink} />
          <CodeBlock code={CODE.scrollMargin} language="css" />

          <h3 className="docs-subtitle">Lazy mount</h3>
          <p>
            <code className="code-inline">lazyMount</code> skips rendering content until an item is first opened. Use it for heavy
            content such as videos, maps or forms. Content that was never opened isn’t in the DOM, so find-in-page and printing
            won’t include it.
          </p>
          <CodeBlock code={CODE.lazy} />

          <h3 className="docs-subtitle">Print</h3>
          <p>
            When printing or saving as PDF, every item is shown expanded and the toolbar is hidden. Turn this off with{' '}
            <code className="code-inline">printExpanded={'{false}'}</code>.
          </p>

          <h3 className="docs-subtitle">SEO: FAQ structured data</h3>
          <p>
            <code className="code-inline">faqSchema</code> outputs{' '}
            <code className="code-inline">schema.org/FAQPage</code> JSON-LD from the <code className="code-inline">items</code> array, which
            helps search engines understand your FAQ. Items whose title or content isn’t plain text are skipped unless you add{' '}
            <code className="code-inline">schemaText</code>.
          </p>
          <CodeBlock code={CODE.schema} />

          <h3 className="docs-subtitle">Dark mode</h3>
          <p>The accordion is always light by default, regardless of the OS setting. It also ships with a dark palette you can turn on with the usual conventions, so it works with most theme switchers:</p>
          <CodeBlock code={CODE.dark} title="HTML" />
        </Section>

        <Section id="styling" title="Styling">
          <p>Customize in layers — use the lightest tool that does the job:</p>
          <ol className="docs-list">
            <li><strong>Props</strong> — <code className="code-inline">variant</code>, <code className="code-inline">size</code>, <code className="code-inline">radius</code>, <code className="code-inline">accentColor</code>, <code className="code-inline">duration</code>.</li>
            <li><strong>CSS variables</strong> — override any <code className="code-inline">--accordion-*</code> variable. Defaults use <code className="code-inline">:where()</code>, so your selectors always win.</li>
            <li><strong>Classes &amp; data attributes</strong> — target slots with <code className="code-inline">classNames</code> and states with <code className="code-inline">[data-state]</code> / <code className="code-inline">[data-disabled]</code>.</li>
            <li><strong>Source</strong> — edit <code className="code-inline">accordion.css</code> or <code className="code-inline">Accordion.jsx</code> directly.</li>
          </ol>
          <CodeBlock code={CODE.cssVars} language="css" />
          <CodeBlock code={CODE.classNames} />

          <h3 className="docs-subtitle">CSS variables</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Variable</th>
                  <th scope="col">Default</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                {cssVariables.map((v) => (
                  <tr key={v.name}>
                    <td><code className="code-inline code-inline--accent">{v.name}</code></td>
                    <td><code className="code-inline">{v.default}</code></td>
                    <td>{v.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="docs-subtitle">Data attributes</h3>
          <ul className="docs-list">
            <li><code className="code-inline">[data-state="open" | "closed"]</code> — on item, trigger and content.</li>
            <li><code className="code-inline">[data-disabled]</code> — on disabled items and on the root when <code className="code-inline">disabled</code>.</li>
            <li><code className="code-inline">[data-variant]</code>, <code className="code-inline">[data-size]</code>, <code className="code-inline">[data-radius]</code>, <code className="code-inline">[data-animated]</code> — on the root.</li>
            <li><code className="code-inline">[data-icon-position]</code> — on each trigger.</li>
          </ul>
        </Section>

        <Section id="api" title="API reference">
          <PropsTable caption="Accordion" rows={accordionProps} />
          <PropsTable caption="AccordionItem" rows={itemProps} />
          <PropsTable caption="AccordionTrigger" rows={triggerProps} />
          <PropsTable caption="AccordionContent" rows={contentProps} />
          <PropsTable caption="AccordionItemData (items array entry)" rows={itemDataShape} />
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-list">
            <li>Each trigger is a native <code className="code-inline">&lt;button&gt;</code> inside a heading (<code className="code-inline">headingLevel</code>).</li>
            <li>Triggers expose <code className="code-inline">aria-expanded</code> and <code className="code-inline">aria-controls</code>; panels use <code className="code-inline">role="region"</code> with <code className="code-inline">aria-labelledby</code>.</li>
            <li>Closed panels are <code className="code-inline">inert</code>, so their content is skipped by Tab and screen readers.</li>
            <li>In single, non-collapsible mode the open trigger gets <code className="code-inline">aria-disabled="true"</code>.</li>
            <li>Respects <code className="code-inline">prefers-reduced-motion</code> and supports RTL through logical CSS properties.</li>
          </ul>
          <div className="table-wrap">
            <table className="table">
              <caption className="table__caption">Keyboard interactions</caption>
              <thead>
                <tr>
                  <th scope="col">Key</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {keyboard.map((k) => (
                  <tr key={k.key}>
                    <td><kbd className="kbd">{k.key}</kbd></td>
                    <td>{k.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </main>
    </div>
  );
}
