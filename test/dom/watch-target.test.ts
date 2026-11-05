/*
 * Ideas 24, 25 and 27: the field menus and the code hooks are handed Home Assistant's card
 * editor before it is defined, so it has no shadow root yet, and its fields render later
 * still, behind more shadow roots. watchTarget has to find them anyway.
 */
import { describe, it, expect, until } from './runner';
import { watchTarget } from '../../src/template-editor/watch-target';
import { deepFind } from '../../src/template-editor/code-editor-hooks';

let counter = 0;

function deepHas(root: Element | ShadowRoot | null | undefined, tag: string): boolean {
  if (!root) return false;
  if (root.querySelector(tag)) return true;
  for (const child of [...root.querySelectorAll('*')]) if (deepHas(child.shadowRoot, tag)) return true;
  return false;
}

describe('watching the card editor', () => {
  it('finds a field drawn behind a nested shadow root after the editor is defined late', async () => {
    const tag = `dcp-late-editor-${++counter}`;
    const target = document.createElement(tag);
    document.body.appendChild(target);
    let found = false;
    const stop = watchTarget(target, () => {
      if (deepHas(target.shadowRoot, 'ha-code-editor')) found = true;
    });
    // Defined after the watch started, as hui-card-element-editor is.
    await new Promise((resolve) => setTimeout(resolve, 50));
    customElements.define(
      tag,
      class extends HTMLElement {
        constructor() {
          super();
          this.attachShadow({ mode: 'open' });
        }
        connectedCallback(): void {
          // The inner editor appears later, inside a shadow root of its own.
          setTimeout(() => {
            const inner = document.createElement('div');
            inner.attachShadow({ mode: 'open' });
            this.shadowRoot!.appendChild(inner);
            setTimeout(() => inner.shadowRoot!.appendChild(document.createElement('ha-code-editor')), 150);
          }, 50);
        }
      },
    );
    await until(() => found, 4000, 'the code editor to be found');
    stop();
    expect(found).to.equal(true);
  });

  it('stops looking once stopped', async () => {
    const target = document.createElement('div');
    target.attachShadow({ mode: 'open' });
    document.body.appendChild(target);
    let calls = 0;
    const stop = watchTarget(target, () => (calls += 1));
    stop();
    const before = calls;
    target.shadowRoot!.appendChild(document.createElement('span'));
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(calls).to.equal(before);
  });
});

describe('finding the code editor', () => {
  it('looks through deeply nested shadow roots once each, not twice per level', () => {
    // Twenty-two levels of host and shadow root, deeper than Home Assistant's tile editor.
    const top = document.createElement('div');
    let at: Element | ShadowRoot = top;
    for (let level = 0; level < 22; level++) {
      const host = document.createElement('div');
      at.appendChild(host);
      at.appendChild(document.createElement('span'));
      at = host.attachShadow({ mode: 'open' });
    }
    const started = performance.now();
    const missing = deepFind(top, 'ha-code-editor');
    const took = performance.now() - started;
    at.appendChild(document.createElement('ha-code-editor'));
    expect(missing).to.equal(undefined);
    expect(took).to.be.below(200);
    expect(deepFind(top, 'ha-code-editor')?.localName).to.equal('ha-code-editor');
  });
});
