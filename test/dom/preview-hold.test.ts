/*
 * #407: the edit dialog's preview held back. While the card editor has it paused, or while
 * a required variable has no value, the card being previewed makes no card inside it - one
 * that asks a server for something would ask on every edit - until Render now is chosen.
 * Nothing else on the page is held.
 */
import { describe, it, expect, settle, until } from './runner';
import { stubHass, stubLovelace } from './stubs';
import { previewEditorOpened, renderPreviewNow, setPreviewPaused } from '../../src/preview-hold';

/* eslint-disable @typescript-eslint/no-explicit-any */

const CARD = 'decluttering-card-plus';
const inner = (element: any): any => element.shadowRoot?.querySelector('hui-card');
const notice = (element: any): any => element.shadowRoot?.querySelector('ha-alert');

function templates(): void {
  stubLovelace({
    decluttering_templates: {
      cam: {
        variables: [
          { name: 'camera', required: true },
          { name: 'title', default: 'x' },
        ],
        card: { type: 'markdown', content: '[[camera]] [[title]]' },
      },
    },
    views: [{ cards: [] }],
  });
}

// The card in an edit dialog, the way Home Assistant previews it: configured, then placed.
function inDialog(config: Record<string, any>): { el: any; dialog: HTMLElement } {
  const dialog = document.createElement('hui-dialog-edit-card');
  const el = document.createElement(CARD) as any;
  el.setConfig(config);
  el.hass = stubHass({});
  dialog.appendChild(el);
  document.body.appendChild(dialog);
  return { el, dialog };
}

function withEditor(run: () => Promise<void>): () => Promise<void> {
  return async () => {
    const closed = previewEditorOpened();
    try {
      await run();
    } finally {
      setPreviewPaused(false);
      closed();
    }
  };
}

describe('preview pause (#407)', () => {
  it(
    'holds the dialog preview while paused, and Render now builds it once',
    withEditor(async () => {
      templates();
      setPreviewPaused(true);
      const { el, dialog } = inDialog({ template: 'cam', variables: [{ camera: 'front' }] });
      await settle();
      expect(inner(el), 'nothing built while paused').to.equal(null);
      expect(notice(el), 'says it is paused').to.not.equal(null);
      renderPreviewNow();
      await until(() => !!inner(el), 2000, 'built by Render now');
      el.hass = stubHass({});
      await settle();
      expect(inner(el), 'hass arriving does not hold the same config again').to.not.equal(null);
      el.setConfig({ template: 'cam', variables: [{ camera: 'back' }] });
      await settle();
      expect(inner(el), 'the next edit is held again').to.equal(null);
      setPreviewPaused(false);
      await until(() => !!inner(el), 2000, 'built on resume');
      dialog.remove();
    }),
  );

  it(
    'pausing drops a preview already built',
    withEditor(async () => {
      templates();
      const { el, dialog } = inDialog({ template: 'cam', variables: [{ camera: 'front' }] });
      await until(() => !!inner(el), 2000, 'built first');
      setPreviewPaused(true);
      await settle();
      expect(inner(el)).to.equal(null);
      dialog.remove();
    }),
  );

  it(
    'leaves a card outside the dialog alone, even configured before it was placed',
    withEditor(async () => {
      templates();
      setPreviewPaused(true);
      const el = document.createElement(CARD) as any;
      el.setConfig({ template: 'cam', variables: [{ camera: 'front' }] });
      el.hass = stubHass({});
      document.body.appendChild(el);
      await until(() => !!inner(el), 2000, 'built once on the page');
      el.remove();
    }),
  );

  it('holds nothing with no card editor open', async () => {
    templates();
    setPreviewPaused(true);
    try {
      const { el, dialog } = inDialog({ template: 'cam', variables: [{ camera: 'front' }] });
      await until(() => !!inner(el), 2000, 'built');
      dialog.remove();
    } finally {
      setPreviewPaused(false);
    }
  });
});

describe('required variables in the preview (#407)', () => {
  it(
    'waits for a required variable, naming it',
    withEditor(async () => {
      templates();
      const { el, dialog } = inDialog({ template: 'cam' });
      await settle();
      expect(inner(el), 'nothing built without camera').to.equal(null);
      expect(String(notice(el)?.textContent ?? '')).to.contain('[[camera]]');
      el.setConfig({ template: 'cam', variables: [{ camera: 'front' }] });
      await until(() => !!inner(el), 2000, 'built once it has a value');
      dialog.remove();
    }),
  );

  it(
    'Render now builds it anyway',
    withEditor(async () => {
      templates();
      const { el, dialog } = inDialog({ template: 'cam' });
      await settle();
      renderPreviewNow();
      await until(() => !!inner(el), 2000, 'built anyway');
      dialog.remove();
    }),
  );

  it('a card on the dashboard still builds without it', async () => {
    templates();
    const closed = previewEditorOpened();
    try {
      const el = document.createElement(CARD) as any;
      el.setConfig({ template: 'cam' });
      el.hass = stubHass({});
      document.body.appendChild(el);
      await until(() => !!inner(el), 2000, 'built as ever');
      el.remove();
    } finally {
      closed();
    }
  });
});

describe('strict (#407)', () => {
  it('refuses before the card inside is made', async () => {
    templates();
    const el = document.createElement(CARD) as any;
    el.setConfig({ template: 'cam', strict: true });
    el.hass = stubHass({});
    document.body.appendChild(el);
    await settle();
    expect(inner(el), 'no card inside').to.equal(null);
    expect(notice(el)?.getAttribute('alert-type')).to.equal('error');
    el.remove();
  });
});
