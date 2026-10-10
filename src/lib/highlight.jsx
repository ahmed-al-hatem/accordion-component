// Tiny regex-based highlighter for JSX / JS / CSS snippets. No dependencies.
const TOKEN_RE = new RegExp(
  [
    String.raw`(?<comment>\/\/[^\n]*|\/\*[\s\S]*?\*\/)`,
    String.raw`(?<string>"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|` + '`(?:[^`\\\\]|\\\\.)*`)',
    String.raw`(?<tagOpen><\/?)(?<tag>[A-Za-z][\w.]*)`,
    String.raw`(?<keyword>\b(?:import|from|export|default|const|let|function|return|if|else|true|false|null|undefined|new)\b)`,
    String.raw`(?<attr>(?:--)?[A-Za-z_$][\w$-]*(?==|\s*:(?!:)))`,
    String.raw`(?<number>#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|ms|rem|em|%|s)?\b)`,
    String.raw`(?<punct>[{}()[\]<>/=;,.:?!&|+*-]+)`,
  ].join('|'),
  'g'
);

export function highlight(code) {
  const nodes = [];
  let last = 0;
  let key = 0;

  for (const match of code.matchAll(TOKEN_RE)) {
    if (match.index > last) nodes.push(code.slice(last, match.index));
    const { groups } = match;

    if (groups.tag) {
      nodes.push(
        <span key={key++} className="tok-punct">{groups.tagOpen}</span>,
        <span key={key++} className="tok-tag">{groups.tag}</span>
      );
    } else {
      const type = Object.keys(groups).find((name) => name !== 'tagOpen' && groups[name] !== undefined);
      nodes.push(
        <span key={key++} className={`tok-${type}`}>
          {match[0]}
        </span>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}
