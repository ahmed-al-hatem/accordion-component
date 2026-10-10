import Navbar from './components/Navbar.jsx';
import Playground from './pages/Playground.jsx';
import Docs from './pages/Docs.jsx';
import useHashRoute from './lib/useHashRoute.js';
import useTheme from './lib/useTheme.js';

export default function App() {
  const { page, section } = useHashRoute();
  const [theme, toggleTheme] = useTheme();
  const isDocs = page === 'docs';

  return (
    <div className="app">
      <Navbar page={isDocs ? 'docs' : 'playground'} theme={theme} onToggleTheme={toggleTheme} />
      {isDocs ? <Docs section={section} /> : <Playground />}
    </div>
  );
}
