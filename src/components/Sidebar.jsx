import { useEffect, useRef, useState } from 'react';
import { ACCENT_SWATCHES, OPTIONS } from '../data/playgroundOptions.js';

function PropName({ children }) {
  return <code className="control__prop">{children}</code>;
}

function Group({ title, children }) {
  return (
    <section className="sidebar__group">
      <h3 className="sidebar__group-title">{title}</h3>
      {children}
    </section>
  );
}

function RadioGroup({ legend, name, value, onChange }) {
  return (
    <fieldset className="control control--fieldset">
      <legend className="control__label">
        {legend} <PropName>{name}</PropName>
      </legend>
      <div className="segmented">
        {OPTIONS[name].map((opt) => (
          <label key={opt.value} className="segmented__option">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => onChange(name, opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Select({ label, name, prop = name, options, value, onChange }) {
  const id = `ctrl-${name}`;
  return (
    <div className="control">
      <label className="control__label" htmlFor={id}>
        {label} {prop && <PropName>{prop}</PropName>}
      </label>
      <select id={id} className="select" value={value} onChange={(e) => onChange(name, e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Range({ label, name, min, max, step = 1, value, unit = '', disabled, onChange }) {
  const id = `ctrl-${name}`;
  return (
    <div className="control">
      <label className="control__label" htmlFor={id}>
        {label} <PropName>{name}</PropName>
      </label>
      <div className="range">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(name, Number(e.target.value))}
        />
        <output className="range__value" htmlFor={id}>
          {value}
          {unit}
        </output>
      </div>
    </div>
  );
}

function Toggle({ name, label, hint, checked, disabled, onChange }) {
  return (
    <div className={`control${disabled ? ' is-disabled' : ''}`}>
      <label className="toggle">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(name, e.target.checked)}
          aria-describedby={hint ? `${name}-hint` : undefined}
        />
        <span className="toggle__track" aria-hidden="true">
          <span className="toggle__thumb" />
        </span>
        <span className="toggle__text">
          {label} <PropName>{name}</PropName>
        </span>
      </label>
      {hint && (
        <p className="control__hint" id={`${name}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}

function ColorControl({ value, onChange }) {
  return (
    <fieldset className="control control--fieldset">
      <legend className="control__label">
        Accent color <PropName>accentColor</PropName>
      </legend>
      <div className="color">
        <input
          type="color"
          className="color__input"
          value={value}
          onChange={(e) => onChange('accentColor', e.target.value)}
          aria-label="Custom accent color"
        />
        <div className="color__swatches">
          {ACCENT_SWATCHES.map((color) => (
            <button
              key={color}
              type="button"
              className="color__swatch"
              style={{ background: color }}
              aria-label={`Use ${color}`}
              aria-pressed={value === color}
              onClick={() => onChange('accentColor', color)}
            />
          ))}
        </div>
      </div>
    </fieldset>
  );
}

function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" className="btn btn--link" onClick={copy}>
      <span aria-live="polite">{copied ? 'Link copied ✓' : 'Copy link'}</span>
    </button>
  );
}

export default function Sidebar({ settings, items, onChange, onReset, maxCount }) {
  const itemOptions = (emptyLabel) => [
    { value: '', label: emptyLabel },
    ...items.map((item, i) => ({ value: item.id, label: `${i + 1}. ${item.title}` })),
  ];

  return (
    <aside className="sidebar" aria-labelledby="sidebar-title">
      <div className="sidebar__header">
        <h2 className="sidebar__title" id="sidebar-title">Props</h2>
        <div className="sidebar__actions">
          <CopyLinkButton />
          <button type="button" className="btn btn--link" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>

      <Group title="Content">
        <Range label="Item count" name="count" min={1} max={Math.min(10, maxCount)} value={settings.count} onChange={onChange} />
        <Select
          label="Open by default"
          name="defaultValue"
          options={itemOptions('None')}
          value={settings.defaultValue}
          onChange={onChange}
        />
        <Select
          label="Disabled item"
          name="disabledItem"
          prop="items[i].disabled"
          options={itemOptions('None')}
          value={settings.disabledItem}
          onChange={onChange}
        />
        <Select label="Heading level" name="headingLevel" options={OPTIONS.headingLevel} value={settings.headingLevel} onChange={onChange} />
      </Group>

      <Group title="Appearance">
        <Select label="Variant" name="variant" options={OPTIONS.variant} value={settings.variant} onChange={onChange} />
        <RadioGroup legend="Size" name="size" value={settings.size} onChange={onChange} />
        <RadioGroup legend="Radius" name="radius" value={settings.radius} onChange={onChange} />
        <ColorControl value={settings.accentColor} onChange={onChange} />
        <RadioGroup legend="Direction" name="dir" value={settings.dir} onChange={onChange} />
      </Group>

      <Group title="Icon">
        <RadioGroup legend="Icon type" name="iconType" value={settings.iconType} onChange={onChange} />
        <RadioGroup legend="Icon position" name="iconPosition" value={settings.iconPosition} onChange={onChange} />
      </Group>

      <Group title="Behavior">
        <Toggle
          name="multiple"
          label="Multiple open"
          hint="Allow more than one item to be open at a time."
          checked={settings.multiple}
          onChange={onChange}
        />
        <Toggle
          name="collapsible"
          label="Collapsible"
          hint={settings.multiple ? 'Always collapsible in multiple mode.' : 'Allow closing the open item in single mode.'}
          checked={settings.collapsible}
          disabled={settings.multiple}
          onChange={onChange}
        />
        <Toggle
          name="disabled"
          label="Disabled"
          hint="Disable every item in the accordion."
          checked={settings.disabled}
          onChange={onChange}
        />
        <Toggle
          name="showCloseAll"
          label="“Close all” button"
          hint="Show a button that closes all open items."
          checked={settings.showCloseAll}
          onChange={onChange}
        />
        <Toggle
          name="showExpandAll"
          label="“Expand all” button"
          hint={settings.multiple ? 'Show a button that opens every item.' : 'Requires multiple mode.'}
          checked={settings.showExpandAll}
          disabled={!settings.multiple}
          onChange={onChange}
        />
      </Group>

      <Group title="Discovery">
        <Toggle
          name="searchable"
          label="Find in page"
          hint="Ctrl+F finds text in closed items and opens them."
          checked={settings.searchable}
          onChange={onChange}
        />
        <Toggle
          name="deepLink"
          label="Deep links"
          hint={`Opening an item sets the URL to #${settings.deepLinkPrefix}<id>, and that link opens it.`}
          checked={settings.deepLink}
          onChange={onChange}
        />
        <Toggle
          name="lazyMount"
          label="Lazy mount"
          hint="Render an item's content only after it is first opened."
          checked={settings.lazyMount}
          onChange={onChange}
        />
        <Toggle
          name="printExpanded"
          label="Expand when printing"
          hint="Show every answer on paper / PDF."
          checked={settings.printExpanded}
          onChange={onChange}
        />
        <Toggle
          name="faqSchema"
          label="FAQ schema (SEO)"
          hint="Add schema.org FAQPage JSON-LD for search engines."
          checked={settings.faqSchema}
          onChange={onChange}
        />
      </Group>

      <Group title="Animation">
        <Toggle
          name="animated"
          label="Animated"
          hint="Enable open/close transitions."
          checked={settings.animated}
          onChange={onChange}
        />
        <Range
          label="Duration"
          name="duration"
          min={0}
          max={1000}
          step={50}
          unit="ms"
          value={settings.duration}
          disabled={!settings.animated}
          onChange={onChange}
        />
      </Group>
    </aside>
  );
}
