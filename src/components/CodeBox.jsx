import CodeBlock from './CodeBlock.jsx';

function formatValue(value) {
  if (typeof value === 'string') return `"${value}"`;
  return `{${value}}`;
}

// Live JSX usage for the playground, listing every prop for clarity.
export default function CodeBox({ props, disabledItem }) {
  const lines = [
    '  items={items}',
    ...Object.entries(props).map(([name, value]) =>
      name === 'defaultValue' && !value ? '  defaultValue={undefined}' : `  ${name}=${formatValue(value)}`
    ),
  ];

  const itemsLine = disabledItem
    ? `const items = faqItems.map((item) =>\n  item.id === "${disabledItem}" ? { ...item, disabled: true } : item\n);`
    : 'const items = faqItems;';

  const code = `${itemsLine}\n\n<Accordion\n${lines.join('\n')}\n/>`;

  return <CodeBlock code={code} title="JSX" />;
}
