// Playground settings: defaults, allowed values and URL (de)serialization.

export const OPTIONS = {
  variant: [
    { value: 'default', label: 'Default' },
    { value: 'border', label: 'Border' },
    { value: 'bold', label: 'Bold' },
    { value: 'bg', label: 'Background' },
    { value: 'separated', label: 'Separated' },
  ],
  size: [
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
  ],
  radius: [
    { value: 'none', label: 'None' },
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
  ],
  dir: [
    { value: 'ltr', label: 'LTR' },
    { value: 'rtl', label: 'RTL' },
  ],
  iconType: [
    { value: 'arrow', label: 'Arrow' },
    { value: 'plus', label: 'Plus' },
    { value: 'none', label: 'None' },
  ],
  iconPosition: [
    { value: 'start', label: 'Start' },
    { value: 'end', label: 'End' },
  ],
  headingLevel: ['h2', 'h3', 'h4', 'h5', 'h6'].map((h) => ({ value: h, label: h })),
};

export const ACCENT_SWATCHES = ['#4f46e5', '#0d9488', '#e11d48', '#d97706', '#0284c7', '#1b1e2b'];

// Props passed straight to <Accordion>.
export const DEFAULT_PROPS = {
  count: 5,
  defaultValue: '',
  variant: 'border',
  size: 'md',
  radius: 'md',
  accentColor: '#4f46e5',
  dir: 'ltr',
  iconType: 'arrow',
  iconPosition: 'end',
  headingLevel: 'h3',
  multiple: false,
  collapsible: true,
  disabled: false,
  showCloseAll: false,
  showExpandAll: false,
  animated: true,
  duration: 250,
  searchable: true,
  lazyMount: false,
  deepLink: true,
  deepLinkPrefix: 'faq-',
  printExpanded: true,
  faqSchema: false,
};

// Playground-only settings that change the data rather than props.
export const DEFAULT_EXTRAS = {
  disabledItem: '',
};

export const DEFAULT_SETTINGS = { ...DEFAULT_PROPS, ...DEFAULT_EXTRAS };

const RANGES = {
  count: [1, 10],
  duration: [0, 1000],
};

function parseValue(name, raw, fallback) {
  if (typeof fallback === 'boolean') {
    if (raw === 'true' || raw === '1') return true;
    if (raw === 'false' || raw === '0') return false;
    return fallback;
  }
  if (typeof fallback === 'number') {
    const n = Number(raw);
    if (!Number.isFinite(n)) return fallback;
    const [min, max] = RANGES[name] ?? [-Infinity, Infinity];
    return Math.min(max, Math.max(min, Math.round(n)));
  }
  if (OPTIONS[name]) {
    return OPTIONS[name].some((o) => o.value === raw) ? raw : fallback;
  }
  if (name === 'accentColor') {
    return /^#[0-9a-f]{6}$/i.test(raw) ? raw.toLowerCase() : fallback;
  }
  return raw;
}

export function settingsFromSearch(search) {
  const params = new URLSearchParams(search);
  const settings = { ...DEFAULT_SETTINGS };
  for (const [name, fallback] of Object.entries(DEFAULT_SETTINGS)) {
    if (params.has(name)) settings[name] = parseValue(name, params.get(name), fallback);
  }
  return settings;
}

// Only non-default values are written, keeping shared links short.
export function settingsToSearch(settings) {
  const params = new URLSearchParams();
  for (const [name, fallback] of Object.entries(DEFAULT_SETTINGS)) {
    if (settings[name] !== fallback) params.set(name, String(settings[name]));
  }
  const query = params.toString();
  return query ? `?${query}` : '';
}
