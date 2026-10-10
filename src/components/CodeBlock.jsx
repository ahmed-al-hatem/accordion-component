import { useEffect, useMemo, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from './Icons.jsx';
import { highlight } from '../lib/highlight.jsx';

export default function CodeBlock({ code, language = 'jsx', title }) {
  const [status, setStatus] = useState('idle');
  const timer = useRef(null);
  const highlighted = useMemo(() => highlight(code), [code]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('idle'), 2000);
  };

  const label = status === 'copied' ? 'Copied ✓' : status === 'error' ? 'Copy failed' : 'Copy';

  return (
    <div className="codebox">
      <div className="codebox__bar">
        <span className="codebox__lang">{title ?? language.toUpperCase()}</span>
        <button
          type="button"
          className={`btn btn--copy${status === 'copied' ? ' is-copied' : ''}`}
          onClick={copy}
        >
          {status === 'copied' ? <CheckIcon /> : <CopyIcon />}
          <span aria-live="polite">{label}</span>
        </button>
      </div>
      <pre className="codebox__pre" dir="ltr">
        <code>{highlighted}</code>
      </pre>
    </div>
  );
}
