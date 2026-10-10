import { useEffect, useState } from 'react';

// Minimal hash router: "#/docs/usage" -> { page: "docs", section: "usage" }.
function parseHash() {
  const [page = '', section = ''] = window.location.hash.replace(/^#\/?/, '').split('/');
  return { page: page || 'playground', section };
}

export default function useHashRoute() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
