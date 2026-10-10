import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import CodeBox from '../components/CodeBox.jsx';
import { Accordion } from '../components/accordion';
import faqItems from '../data/faq.js';
import {
  DEFAULT_EXTRAS,
  DEFAULT_SETTINGS,
  settingsFromSearch,
  settingsToSearch,
} from '../data/playgroundOptions.js';

const splitSettings = (settings) => {
  const props = { ...settings };
  const extras = {};
  for (const key of Object.keys(DEFAULT_EXTRAS)) {
    extras[key] = props[key];
    delete props[key];
  }
  return { props, extras };
};

export default function Playground() {
  const [settings, setSettings] = useState(() => settingsFromSearch(window.location.search));

  // Keep the URL query in sync so any configuration can be shared as a link.
  useEffect(() => {
    const { pathname, hash } = window.location;
    window.history.replaceState(window.history.state, '', pathname + settingsToSearch(settings) + hash);
  }, [settings]);

  const updateSetting = (name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const resetSettings = () => setSettings(DEFAULT_SETTINGS);

  const { props, extras } = splitSettings(settings);

  const items = useMemo(
    () =>
      faqItems.map((item) => (item.id === extras.disabledItem ? { ...item, disabled: true } : item)),
    [extras.disabledItem]
  );

  // defaultValue only applies on mount, so remount when it changes.
  const accordionKey = `${props.defaultValue}`;

  return (
    <div className="layout">
      <Sidebar
        settings={settings}
        items={faqItems.slice(0, settings.count)}
        onChange={updateSetting}
        onReset={resetSettings}
        maxCount={faqItems.length}
      />
      <main className="main" id="main" tabIndex={-1}>
        <section className="panel" aria-labelledby="preview-title">
          <h2 className="panel__title" id="preview-title">Preview</h2>
          <Accordion
            key={accordionKey}
            items={items}
            {...props}
            defaultValue={props.defaultValue || undefined}
          />
        </section>
        <section className="panel" aria-labelledby="code-title">
          <h2 className="panel__title" id="code-title">code</h2>
          <CodeBox props={props} disabledItem={extras.disabledItem} />
        </section>
      </main>
    </div>
  );
}
