/*
 * What the first round on the dev Home Assistant turned up in the template editor, pinned
 * in a real browser: a tab shown from the keyboard switched the strip but not the panel
 * (idea 55).
 */
import { describe, it, expect, settle, until } from './runner';
import { stubHass, stubLovelace } from './stubs';

/* eslint-disable @typescript-eslint/no-explicit-any */

function templateEditor(): any {
  const lovelace = stubLovelace({
    decluttering_templates: { t: { card: { type: 'markdown', content: '[[name]]' } } },
    views: [{ cards: [{ type: 'custom:decluttering-card-plus', template: 't', variables: [{ name: 'x' }] }] }],
  });
  const editor = document.createElement('decluttering-template-plus-editor') as any;
  editor.hass = stubHass();
  editor.lovelace = lovelace.config;
  editor.setConfig({
    type: 'custom:decluttering-template-plus',
    template: 't',
    card: { type: 'markdown', content: '[[name]]' },
  });
  document.body.appendChild(editor);
  return editor;
}

const shareTab = (editor: any): any => editor.shadowRoot?.querySelector('decluttering-template-share-tab');

describe('keyboard tabs', () => {
  it('a tab shown by the strip without a click switches the panel and moves focus to its heading', async () => {
    const editor = templateEditor();
    await settle(4);
    const strip = editor.shadowRoot.querySelector('ha-tab-group');
    expect(!!strip, 'the tab strip rendered').to.equal(true);
    strip.dispatchEvent(new CustomEvent('wa-tab-show', { detail: { name: 'share' }, bubbles: true, composed: true }));
    await until(() => editor._selectedTab === 'share', 2000, 'the share panel');
    await settle(4);
    expect(!!shareTab(editor), 'the share tab is drawn').to.equal(true);
    const heading = editor.shadowRoot.querySelector('#panel-heading');
    expect(editor.shadowRoot.activeElement === heading, 'focus moved to the panel heading').to.equal(true);
  });

  it('a pointer click on a tab switches the panel without stealing focus', async () => {
    const editor = templateEditor();
    await settle(4);
    const strip = editor.shadowRoot.querySelector('ha-tab-group');
    strip.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, composed: true }));
    strip.dispatchEvent(new CustomEvent('wa-tab-show', { detail: { name: 'usages' }, bubbles: true, composed: true }));
    await until(() => editor._selectedTab === 'usages', 2000, 'the usages panel');
    await settle(2);
    const heading = editor.shadowRoot.querySelector('#panel-heading');
    expect(editor.shadowRoot.activeElement === heading, 'focus stayed where the pointer left it').to.equal(false);
  });
});

/*
 * Home Assistant's ha-yaml-editor reads defaultValue once, when it first draws. This stand-in
 * does the same, so a converted YAML that only had its property changed would keep showing
 * the first conversion - what the dev Home Assistant showed after a second paste (#296).
 */
class OnceYamlEditor extends HTMLElement {
  public shown: unknown;
  private _seen = false;
  set defaultValue(value: unknown) {
    if (this._seen) return;
    this._seen = true;
    this.shown = value;
  }
  get defaultValue(): unknown {
    return this.shown;
  }
}

describe('convert from another card', () => {
  it('a second paste shows its own conversion, not the first one', async () => {
    if (!customElements.get('ha-yaml-editor')) customElements.define('ha-yaml-editor', OnceYamlEditor);
    const editor = templateEditor();
    await settle(4);
    editor.shadowRoot
      .querySelector('ha-tab-group')
      .dispatchEvent(new CustomEvent('wa-tab-show', { detail: { name: 'share' }, bubbles: true, composed: true }));
    await until(() => !!shareTab(editor)?.shadowRoot?.querySelector('#convert'), 2000, 'the convert box');
    const tab = shareTab(editor);
    const paste = (value: unknown): void => {
      tab.shadowRoot
        .querySelector('#convert')
        .dispatchEvent(new CustomEvent('value-changed', { detail: { value, isValid: true } }));
    };
    const auto = (domain: string): unknown => ({
      type: 'custom:auto-entities',
      card: { type: 'entities' },
      filter: { include: [{ domain }] },
    });
    paste(auto('light'));
    await tab.updateComplete;
    await settle(2);
    const shown = (): any => (tab.shadowRoot.querySelector('#converted') as any)?.defaultValue;
    expect(JSON.stringify(shown()), 'the first conversion is shown').to.contain('"domain":"light"');
    paste(auto('switch'));
    await tab.updateComplete;
    await settle(2);
    expect(JSON.stringify(shown()), 'the second conversion is shown').to.contain('"domain":"switch"');
    expect(JSON.stringify(shown()), 'the first one is gone').not.to.contain('"domain":"light"');
    expect(!!tab.shadowRoot.querySelector('#converted-card'), 'the card to put on the dashboard is drawn').to.equal(
      true,
    );
    editor.remove();
  });
});
