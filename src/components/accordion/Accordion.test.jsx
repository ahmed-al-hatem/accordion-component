import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './index.js';

const items = [
  { value: 'one', title: 'Question one', content: 'Answer one' },
  { value: 'two', title: 'Question two', content: 'Answer two' },
  { value: 'three', title: 'Question three', content: 'Answer three' },
];

const trigger = (name) => screen.getByRole('button', { name });
const expanded = () =>
  screen
    .getAllByRole('button')
    .filter((b) => b.hasAttribute('aria-expanded'))
    .map((b) => b.getAttribute('aria-expanded') === 'true');

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

// Run a test as if the browser lacked hidden="until-found" support.
function withoutUntilFound(fn) {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'onbeforematch');
  delete HTMLElement.prototype.onbeforematch;
  return Promise.resolve(fn()).finally(() => {
    if (descriptor) Object.defineProperty(HTMLElement.prototype, 'onbeforematch', descriptor);
  });
}

describe('Accordion — structure & accessibility', () => {
  it('renders each trigger as a button inside the chosen heading level', () => {
    render(<Accordion items={items} headingLevel="h4" />);
    const headings = screen.getAllByRole('heading', { level: 4 });
    expect(headings).toHaveLength(3);
    expect(headings[0]).toContainElement(trigger('Question one'));
  });

  it('links triggers and regions with aria attributes', async () => {
    render(<Accordion items={items} />);
    const button = trigger('Question one');
    const region = document.getElementById(button.getAttribute('aria-controls'));
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(region).toHaveAttribute('role', 'region');
    expect(region).toHaveAttribute('aria-labelledby', button.id);
  });

  it('makes closed panels inert when hidden="until-found" is unsupported', () =>
    withoutUntilFound(async () => {
      expect('onbeforematch' in HTMLElement.prototype).toBe(false);
      render(<Accordion items={items} />);
      const region = document.getElementById(trigger('Question one').getAttribute('aria-controls'));
      expect(region).toHaveAttribute('inert');
      await userEvent.click(trigger('Question one'));
      expect(region).not.toHaveAttribute('inert');
    }));

  it('throws a helpful error when parts are used outside <Accordion>', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<AccordionItem value="x" />)).toThrow(/inside <Accordion>/);
    console.error.mockRestore();
  });
});

describe('Accordion — open state', () => {
  it('opens one item at a time in single mode', async () => {
    render(<Accordion items={items} />);
    await userEvent.click(trigger('Question one'));
    await userEvent.click(trigger('Question two'));
    expect(expanded()).toEqual([false, true, false]);
  });

  it('closes the open item when clicked again (collapsible)', async () => {
    render(<Accordion items={items} />);
    await userEvent.click(trigger('Question one'));
    await userEvent.click(trigger('Question one'));
    expect(expanded()).toEqual([false, false, false]);
  });

  it('keeps the open item open when collapsible is false', async () => {
    render(<Accordion items={items} collapsible={false} />);
    await userEvent.click(trigger('Question one'));
    await userEvent.click(trigger('Question one'));
    expect(expanded()).toEqual([true, false, false]);
    expect(trigger('Question one')).toHaveAttribute('aria-disabled', 'true');
  });

  it('allows several open items in multiple mode', async () => {
    render(<Accordion items={items} multiple />);
    await userEvent.click(trigger('Question one'));
    await userEvent.click(trigger('Question three'));
    expect(expanded()).toEqual([true, false, true]);
  });

  it('keeps only the last opened item when switching multiple off', async () => {
    const { rerender } = render(<Accordion items={items} multiple />);
    await userEvent.click(trigger('Question three'));
    await userEvent.click(trigger('Question one'));
    rerender(<Accordion items={items} multiple={false} />);
    expect(expanded()).toEqual([true, false, false]);
  });

  it('respects defaultValue', () => {
    render(<Accordion items={items} multiple defaultValue={['two', 'three']} />);
    expect(expanded()).toEqual([false, true, true]);
  });

  it('supports controlled usage', async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('two');
      return (
        <>
          <Accordion
            items={items}
            value={value}
            onValueChange={(v) => {
              onValueChange(v);
              setValue(v);
            }}
          />
          <span data-testid="value">{String(value)}</span>
        </>
      );
    }
    render(<Controlled />);
    expect(expanded()).toEqual([false, true, false]);
    await userEvent.click(trigger('Question three'));
    expect(onValueChange).toHaveBeenLastCalledWith('three');
    expect(screen.getByTestId('value')).toHaveTextContent('three');
    await userEvent.click(trigger('Question three'));
    expect(onValueChange).toHaveBeenLastCalledWith(null);
  });

  it('emits arrays in multiple mode', async () => {
    const onValueChange = vi.fn();
    render(<Accordion items={items} multiple onValueChange={onValueChange} />);
    await userEvent.click(trigger('Question one'));
    await userEvent.click(trigger('Question two'));
    expect(onValueChange).toHaveBeenLastCalledWith(['one', 'two']);
  });

  it('renders only `count` items and drops hidden ones from the open state', async () => {
    const { rerender } = render(<Accordion items={items} multiple count={3} />);
    await userEvent.click(trigger('Question three'));
    rerender(<Accordion items={items} multiple count={2} />);
    expect(screen.queryByRole('button', { name: 'Question three' })).not.toBeInTheDocument();
    rerender(<Accordion items={items} multiple count={3} />);
    expect(expanded()).toEqual([false, false, false]);
  });
});

describe('Accordion — disabled', () => {
  it('disables every trigger when disabled', () => {
    render(<Accordion items={items} disabled />);
    expect(screen.getAllByRole('button').every((b) => b.disabled)).toBe(true);
  });

  it('disables a single item from data', () => {
    render(<Accordion items={[items[0], { ...items[1], disabled: true }, items[2]]} />);
    expect(trigger('Question two')).toBeDisabled();
    expect(trigger('Question one')).toBeEnabled();
  });
});

describe('Accordion — keyboard', () => {
  it('moves focus with arrows, Home and End, wrapping and skipping disabled items', async () => {
    const user = userEvent.setup();
    render(<Accordion items={[items[0], { ...items[1], disabled: true }, items[2]]} />);
    trigger('Question one').focus();

    await user.keyboard('{ArrowDown}');
    expect(trigger('Question three')).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(trigger('Question one')).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(trigger('Question three')).toHaveFocus();
    await user.keyboard('{Home}');
    expect(trigger('Question one')).toHaveFocus();
    await user.keyboard('{End}');
    expect(trigger('Question three')).toHaveFocus();
  });

  it('toggles with Enter and Space', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    trigger('Question one').focus();
    await user.keyboard('{Enter}');
    expect(expanded()[0]).toBe(true);
    await user.keyboard(' ');
    expect(expanded()[0]).toBe(false);
  });
});

describe('Accordion — toolbar', () => {
  it('closes everything with “Close all”', async () => {
    render(<Accordion items={items} multiple defaultValue={['one', 'two']} showCloseAll />);
    await userEvent.click(screen.getByRole('button', { name: 'Close all' }));
    expect(expanded()).toEqual([false, false, false]);
    expect(screen.getByRole('button', { name: 'Close all' })).toBeDisabled();
  });

  it('opens every enabled item with “Expand all”', async () => {
    render(
      <Accordion items={[items[0], { ...items[1], disabled: true }, items[2]]} multiple showExpandAll />
    );
    await userEvent.click(screen.getByRole('button', { name: 'Expand all' }));
    expect(expanded()).toEqual([true, false, true]);
  });

  it('hides “Expand all” in single mode and supports custom labels', () => {
    render(<Accordion items={items} showExpandAll showCloseAll closeAllLabel="إغلاق الكل" />);
    expect(screen.queryByRole('button', { name: 'Expand all' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'إغلاق الكل' })).toBeInTheDocument();
  });
});

describe('Accordion — composition', () => {
  it('works with composed parts and custom content', async () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger>Alpha</AccordionTrigger>
          <AccordionContent>
            <ul>
              <li>Nested list</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger headingLevel="h2">Beta</AccordionTrigger>
          <AccordionContent>Beta content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    await userEvent.click(trigger('Alpha'));
    expect(screen.getByText('Nested list')).toBeVisible();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Beta');
  });

  it('lets onClick cancel toggling with preventDefault', async () => {
    render(
      <Accordion>
        <AccordionItem value="a">
          <AccordionTrigger onClick={(e) => e.preventDefault()}>Alpha</AccordionTrigger>
          <AccordionContent>Alpha content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    await userEvent.click(trigger('Alpha'));
    expect(trigger('Alpha')).toHaveAttribute('aria-expanded', 'false');
  });

  it('applies className and classNames slots', () => {
    const { container } = render(
      <Accordion items={items} className="faq" classNames={{ item: 'faq-item', trigger: 'faq-trigger' }} />
    );
    expect(container.querySelector('.accordion')).toHaveClass('faq');
    expect(container.querySelectorAll('.faq-item')).toHaveLength(3);
    expect(trigger('Question one')).toHaveClass('faq-trigger');
  });
});

describe('Accordion — features', () => {
  it('lazyMount renders content only after the first open', async () => {
    render(<Accordion items={items} lazyMount />);
    expect(screen.queryByText('Answer one')).not.toBeInTheDocument();
    await userEvent.click(trigger('Question one'));
    expect(screen.getByText('Answer one')).toBeInTheDocument();
    await userEvent.click(trigger('Question one'));
    expect(screen.getByText('Answer one')).toBeInTheDocument();
  });

  it('deepLink opens the item named in the hash', () => {
    window.history.replaceState(null, '', '/#faq-two');
    render(<Accordion items={items} deepLink deepLinkPrefix="faq-" />);
    expect(expanded()).toEqual([false, true, false]);
    expect(document.getElementById('faq-two')).toBeInTheDocument();
  });

  it('deepLink writes the hash when opening and clears it when closing', async () => {
    render(<Accordion items={items} deepLink deepLinkPrefix="faq-" />);
    await userEvent.click(trigger('Question three'));
    expect(window.location.hash).toBe('#faq-three');
    await userEvent.click(trigger('Question three'));
    expect(window.location.hash).toBe('');
  });

  it('deepLink reacts to hashchange', () => {
    render(<Accordion items={items} deepLink />);
    act(() => {
      window.history.replaceState(null, '', '/#one');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(expanded()).toEqual([true, false, false]);
  });

  it('faqSchema outputs FAQPage JSON-LD for plain-text items', () => {
    const { container } = render(
      <Accordion
        items={[...items, { value: 'jsx', title: 'JSX item', content: <b>rich</b> }]}
        faqSchema
      />
    );
    const json = JSON.parse(container.querySelector('script[type="application/ld+json"]').textContent);
    expect(json['@type']).toBe('FAQPage');
    expect(json.mainEntity).toHaveLength(3);
    expect(json.mainEntity[0]).toMatchObject({ name: 'Question one', acceptedAnswer: { text: 'Answer one' } });
  });

  it('sets the theme hooks: data attributes and CSS variables', () => {
    const { container } = render(
      <Accordion items={items} variant="bg" size="lg" radius="none" accentColor="#e11d48" duration={400} dir="rtl" />
    );
    const root = container.querySelector('.accordion');
    expect(root).toHaveAttribute('data-variant', 'bg');
    expect(root).toHaveAttribute('data-size', 'lg');
    expect(root).toHaveAttribute('data-radius', 'none');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root.style.getPropertyValue('--accordion-accent')).toBe('#e11d48');
    expect(root.style.getPropertyValue('--accordion-duration')).toBe('400ms');
  });
});

describe('Accordion — find in page (hidden="until-found")', () => {
  it('hides closed content with until-found and opens on beforematch', () => {
    expect('onbeforematch' in HTMLElement.prototype).toBe(true);
    vi.useFakeTimers();
    try {
      render(<Accordion items={items} />);
      act(() => vi.runAllTimers());
      const body = screen.getByText('Answer two');
      expect(body).toHaveAttribute('hidden', 'until-found');
      expect(body.closest('[role="region"]')).not.toHaveAttribute('inert');

      act(() => {
        body.removeAttribute('hidden');
        body.dispatchEvent(new Event('beforematch'));
      });
      expect(expanded()).toEqual([false, true, false]);
    } finally {
      vi.useRealTimers();
    }
  });
});
