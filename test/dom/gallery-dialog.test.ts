/*
 * The gallery dialog, pinned in a real browser: it survived its first click only when the
 * element is kept rather than re-created (idea 52).
 */
import { describe, it, expect, settle } from './runner';
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

describe('gallery dialog', () => {
  it('is the same element after a tile is picked, so picking one does not close it', async () => {
    const editor = templateEditor();
    await settle(4);
    editor._selectedTab = 'share';
    await settle(4);
    const share = shareTab(editor);
    expect(!!share, 'the share tab rendered').to.equal(true);
    share._galleryOpen = true;
    await settle(4);
    const gallery = share.shadowRoot.querySelector('decluttering-card-plus-gallery');
    expect(!!gallery, 'the gallery element rendered').to.equal(true);
    const first = gallery.entries[0];
    expect(!!first, 'the library gave the gallery its tiles').to.equal(true);
    gallery.dispatchEvent(
      new CustomEvent('gallery-select', { detail: { key: first.key }, bubbles: true, composed: true }),
    );
    await settle(4);
    const again = share.shadowRoot.querySelector('decluttering-card-plus-gallery');
    expect(again === gallery, 'the gallery element was kept, not re-created').to.equal(true);
    expect(share._galleryOpen, 'the gallery is still open').to.equal(true);
    expect(again.selectedKey).to.equal(first.key);
  });
});
