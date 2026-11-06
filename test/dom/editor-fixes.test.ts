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
