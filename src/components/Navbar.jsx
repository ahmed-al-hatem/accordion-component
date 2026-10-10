import { LogoIcon, MoonIcon, SunIcon } from './Icons.jsx';

const LINKS = [
  { page: 'playground', href: '#/', label: 'Playground' },
  { page: 'docs', href: '#/docs', label: 'Docs' },
  // Original vanilla HTML/JS version, served as-is from public/legacy/.
  { page: 'legacy', href: `${import.meta.env.BASE_URL}legacy/index.html`, label: 'Legacy' },
];

export default function Navbar({ page, theme, onToggleTheme }) {
  const skipToContent = (event) => {
    event.preventDefault();
    document.getElementById('main')?.focus();
  };

  return (
    <header className="navbar">
      <a className="skip-link" href="#main" onClick={skipToContent}>
        Skip to content
      </a>
      <div className="navbar__inner">
        <a className="navbar__brand" href="#/">
          <span className="navbar__logo">
            <LogoIcon />
          </span>
          <span className="navbar__title">Accordion Component</span>
        </a>
        <nav className="navbar__nav" aria-label="Main">
          {LINKS.map((link) => (
            <a
              key={link.page}
              href={link.href}
              className="navbar__link"
              aria-current={page === link.page ? 'page' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
}
