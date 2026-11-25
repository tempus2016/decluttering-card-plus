/*
 * What the first round on the dev Home Assistant turned up in the template editor, pinned
 * in a real browser: a tab shown from the keyboard switched the strip but not the panel
 * (idea 55).
 */
import { describe, it, expect, settle, until } from './runner';
import { stubHass, stubLovelace } from './stubs';
import { setPreviewPaused } from '../../src/preview-hold';

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
  it('a tab chosen with Enter from the strip switches the panel and moves focus to its heading', async () => {
    const editor = templateEditor();
    await settle(4);
    const strip = editor.shadowRoot.querySelector('ha-tab-group');
    expect(!!strip, 'the tab strip rendered').to.equal(true);
    strip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    strip.dispatchEvent(new CustomEvent('wa-tab-show', { detail: { name: 'share' }, bubbles: true, composed: true }));
    await until(() => editor._selectedTab === 'share', 2000, 'the share panel');
    await settle(4);
    expect(!!shareTab(editor), 'the share tab is drawn').to.equal(true);
    const heading = editor.shadowRoot.querySelector('#panel-heading');
    expect(editor.shadowRoot.activeElement === heading, 'focus moved to the panel heading').to.equal(true);
  });

  it('an arrow key along the strip switches the panel and leaves focus on the strip', async () => {
    const editor = templateEditor();
    await settle(4);
    const strip = editor.shadowRoot.querySelector('ha-tab-group');
    strip.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, composed: true }));
    strip.dispatchEvent(new CustomEvent('wa-tab-show', { detail: { name: 'usages' }, bubbles: true, composed: true }));
    await until(() => editor._selectedTab === 'usages', 2000, 'the usages panel');
    await settle(2);
    const heading = editor.shadowRoot.querySelector('#panel-heading');
    expect(editor.shadowRoot.activeElement === heading, 'focus stayed on the strip').to.equal(false);
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

/*
 * The card's editor is also a section strategy's options (#400), mounted by Home Assistant
 * inside hui-section-strategy-element-editor, which writes whatever the editor fires as the
 * section's `strategy:`. Ejecting a group there wrote the group card as the strategy, a
 * strategy type that does not exist, and the section broke - so it is not offered there.
 */
describe('eject and section strategies (#400)', () => {
  const roomGroup = {
    default: [{ area: 'living_room' }],
    group: [
      { type: 'heading', heading: 'GROUP [[area]]' },
      { type: 'tile', entity: 'light.[[area]]' },
    ],
  };
  const mount = (host?: HTMLElement): any => {
    const lovelace = stubLovelace({ decluttering_templates: { room_group: roomGroup }, views: [{ cards: [] }] });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    editor.hass = stubHass({ 'light.living_room': 'on' });
    editor.lovelace = lovelace.config;
    editor.setConfig({ type: 'custom:decluttering-card-plus', template: 'room_group' });
    // The "What it builds" panel starts folded (#488); eject is inside it.
    editor._resultOpen = true;
    if (host) {
      const root = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
      root.appendChild(editor);
      document.body.appendChild(host);
    } else {
      document.body.appendChild(editor);
    }
    return editor;
  };
  const buttons = (editor: any): string[] =>
    [...(editor.shadowRoot?.querySelectorAll('ha-button') ?? [])].map((each: any) => each.textContent.trim());
  const alerts = (editor: any): string[] =>
    [...(editor.shadowRoot?.querySelectorAll('ha-alert') ?? [])].map((each: any) => each.textContent.trim());
  const EJECT = 'Replace this card with what it builds';

  it('a card editor offers eject for a group template', async () => {
    const editor = mount();
    await until(() => buttons(editor).includes(EJECT), 3000, 'the eject button');
    editor.remove();
  });

  it('a section strategy editor does not offer eject', async () => {
    const host = document.createElement('hui-section-strategy-element-editor');
    const editor = mount(host);
    // The preview's own buttons are drawn, so eject would be by now.
    await until(() => buttons(editor).some((text) => text.startsWith('Copy')), 3000, 'the preview');
    expect(buttons(editor), 'no eject').not.to.include(EJECT);
    let fired = 0;
    editor.addEventListener('config-changed', () => (fired += 1));
    await settle(2);
    expect(fired, 'nothing written to the strategy').to.equal(0);
    host.remove();
  });

  it('a group template is not said to use a variable named after its cards', async () => {
    const editor = mount();
    await until(() => buttons(editor).includes(EJECT), 3000, 'the preview');
    await settle(2);
    expect(
      alerts(editor).some((text) => text.includes('no value and no default')),
      'no garbled missing-variable warning',
    ).to.equal(false);
    editor.remove();
  });
});

/*
 * #411: a default read from an entity's attribute showed blank in the card editor, even with
 * the entity in the card's rebuild_on, because the shown defaults were worked out with the
 * whole of hass rather than the states the card is allowed to read. The card itself filled
 * it in, so the field and the card disagreed.
 */
describe('attr: defaults in the card editor (#411)', () => {
  const camera = {
    variables: [
      { name: 'camera', selector: { entity: {} } },
      { name: 'stream', selector: { text: {} }, default: '[[camera|attr:camera_name]]' },
      { name: 'zone', selector: { text: {} }, default: '[[stream|lower]]_zone' },
    ],
    card: { type: 'markdown', content: '[[stream]] [[zone]]' },
  };
  const mount = (rebuildOn?: string): any => {
    const lovelace = stubLovelace({ decluttering_templates: { camera }, views: [{ cards: [] }] });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    const hass = stubHass({ 'camera.front': 'idle' });
    hass.states['camera.front'].attributes.camera_name = 'Front_Door';
    editor.hass = hass;
    editor.lovelace = lovelace.config;
    editor.setConfig({
      type: 'custom:decluttering-card-plus',
      template: 'camera',
      variables: [{ camera: 'camera.front' }],
      ...(rebuildOn ? { rebuild_on: rebuildOn } : {}),
    });
    document.body.appendChild(editor);
    return editor;
  };
  const shown = (editor: any, name: string): unknown => editor._shownAs?.get(name)?.shown;

  it('shows the attribute once the card rebuilds on the entity, and a default made from it', async () => {
    const editor = mount('camera.front');
    await until(() => shown(editor, 'stream') !== undefined, 3000, 'the stream default');
    expect(shown(editor, 'stream'), 'the attribute').to.equal('Front_Door');
    expect(shown(editor, 'zone'), 'the default built on it').to.equal('front_door_zone');
    editor.remove();
  });

  it('leaves it blank when the card does not rebuild on the entity, as the card does', async () => {
    const editor = mount();
    await until(() => editor._shownAs !== undefined && editor.shadowRoot?.querySelector('ha-form'), 3000, 'the form');
    await settle(4);
    expect(shown(editor, 'stream'), 'nothing shown').to.equal(undefined);
    editor.remove();
  });
});

/*
 * #255: a declared field the card sets, with a default to go back to, carries a Reset beside
 * it. Pressing it fires config-changed with the card's own line taken out - in the shape the
 * card wrote - so undo and the preview follow as they do for any edit.
 */
describe('reset to default (#255)', () => {
  const template = {
    variables: [
      { name: 'entity', selector: { entity: {} } },
      { name: 'icon', selector: { icon: {} }, default: 'mdi:lightbulb' },
      { name: 'title', selector: { text: {} }, default: '[[room]] lights' },
      { name: 'room', selector: { text: {} } },
      { name: 'mode', selector: { text: {} }, default: 'full' },
      { name: 'detail', selector: { text: {} }, default: 'some', show_if: 'mode=full' },
      { name: 'colour', selector: { text: {} }, default: 'amber', group: 'Style' },
    ],
    card: { type: 'markdown', content: '[[icon]] [[title]] [[colour]] [[detail]]' },
  };
  const mount = (variables: unknown, more: Record<string, unknown> = {}): any => {
    const lovelace = stubLovelace({
      decluttering_templates: { lamp: { ...template, ...more } },
      decluttering_defaults: [{ room: 'Den' }],
      views: [{ cards: [] }],
    });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    editor.hass = stubHass({ 'light.a': 'on' });
    editor.lovelace = lovelace.config;
    editor.setConfig({ type: 'custom:decluttering-card-plus', template: 'lamp', variables });
    document.body.appendChild(editor);
    return editor;
  };
  const resets = (editor: any): string[] =>
    [...(editor.shadowRoot?.querySelectorAll('ha-icon-button.reset') ?? [])].map((each: any) =>
      each.getAttribute('data-variable'),
    );
  const press = async (editor: any, name: string): Promise<any> => {
    let config: any;
    editor.addEventListener('config-changed', (ev: CustomEvent) => (config = ev.detail.config), { once: true });
    editor.shadowRoot.querySelector(`ha-icon-button.reset[data-variable="${name}"]`).click();
    await settle(1);
    return config;
  };
  // The default line under a field (#483), as it reads.
  const lineOf = (editor: any, name: string): string | undefined =>
    editor.shadowRoot?.querySelector(`.default-line[data-default="${name}"]`)?.textContent.replace(/\s+/g, ' ').trim();

  it('only set fields with a default have a Reset, in groups too', async () => {
    const editor = mount([
      { entity: 'light.a' },
      { icon: 'mdi:x' },
      { colour: 'red' },
      { title: 'Mine' },
      { room: 'Hall' },
    ]);
    await until(() => resets(editor).length > 0, 3000, 'the resets');
    expect(resets(editor), 'icon, title, room and the grouped colour').to.have.members([
      'icon',
      'title',
      'room',
      'colour',
    ]);
    expect(lineOf(editor, 'room'), 'a dashboard default says so').to.equal('Default from the dashboard: Den');
    expect(
      editor.shadowRoot.querySelector('ha-expansion-panel.declared-group [data-variable="colour"]'),
      'the grouped Reset sits in its group',
    ).to.not.equal(null);
    expect(lineOf(editor, 'icon'), "the template's own default is just the default").to.equal('Default: mdi:lightbulb');
    expect(lineOf(editor, 'title'), 'a computed default is worked out, without how (#483)').to.equal(
      'Default: Hall lights',
    );
    expect(lineOf(editor, 'mode'), 'a field still at its default has no line (#483)').to.equal(undefined);
    editor.remove();
  });

  it('editor_hide: defaults leaves the default lines out and keeps the Resets (#483)', async () => {
    const editor = mount([{ icon: 'mdi:x' }], { editor_hide: 'defaults' });
    await until(() => resets(editor).includes('icon'), 3000, 'the icon Reset');
    expect(editor.shadowRoot.querySelector('.default-line'), 'no line').to.equal(null);
    editor.remove();
  });

  it('Reset takes the line out, list form', async () => {
    const editor = mount([{ entity: 'light.a' }, { icon: 'mdi:x' }]);
    await until(() => resets(editor).includes('icon'), 3000, 'the icon Reset');
    const config = await press(editor, 'icon');
    expect(config.variables, 'only entity left').to.deep.equal([{ entity: 'light.a' }]);
    expect(config.template, 'the rest kept').to.equal('lamp');
    editor.remove();
  });

  it('Reset keeps the mapping form', async () => {
    const editor = mount({ entity: 'light.a', icon: 'mdi:x' });
    await until(() => resets(editor).includes('icon'), 3000, 'the icon Reset');
    const config = await press(editor, 'icon');
    expect(config.variables, 'still a mapping').to.deep.equal({ entity: 'light.a' });
    editor.remove();
  });

  it('a field hidden by show_if has no Reset', async () => {
    const editor = mount([{ mode: 'short' }, { detail: 'lots' }]);
    await until(() => resets(editor).includes('mode'), 3000, 'the mode Reset');
    expect(resets(editor), 'detail is hidden').to.not.include('detail');
    editor.remove();
  });
});

/*
 * #430: the card editor keeps its builds until something they read changes. A state changing
 * anywhere else builds nothing; the entity the card rebuilds on changing still shows at once,
 * in the Result and in a default read from its attribute. Paused, the Result is not built.
 */
describe('editor builds kept (#430)', () => {
  const camera = (name: string): any => ({
    entity_id: 'camera.front',
    state: 'idle',
    attributes: { camera_name: name },
  });
  // As Home Assistant hands it: a new hass and states, the registries and the rest kept.
  const base = stubHass({});
  const lampState = (state: string): any => ({ entity_id: 'light.lamp', state, attributes: {} });
  const house = (name: string | any, lamp: string): any => ({
    ...base,
    states: { 'camera.front': typeof name === 'string' ? camera(name) : name, 'light.lamp': lampState(lamp) },
  });
  const shownStream = (editor: any): unknown => {
    for (const form of editor.shadowRoot.querySelectorAll('ha-form') as any) {
      if (form.data && 'variable:stream' in form.data) return form.data['variable:stream'];
    }
    return undefined;
  };
  const yaml = (editor: any): string => editor.shadowRoot.querySelector('pre.yaml')?.textContent ?? '';

  it('only the entities rebuilt on make it build again, and a paused preview builds nothing', async () => {
    const lovelace = stubLovelace({
      decluttering_templates: {
        cam: {
          rebuild_on: ['[[camera]]'],
          variables: [
            { name: 'camera', selector: { entity: {} } },
            { name: 'stream', selector: { text: {} }, default: '[[camera|attr:camera_name]]' },
          ],
          card: { type: 'markdown', content: 'stream [[stream]]' },
        },
      },
      views: [{ cards: [] }],
    });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    editor.hass = house('Front_Door', 'off');
    editor.lovelace = lovelace.config;
    editor.setConfig({
      type: 'custom:decluttering-card-plus',
      template: 'cam',
      variables: [{ camera: 'camera.front' }],
    });
    editor._resultOpen = true;
    document.body.appendChild(editor);
    await until(() => yaml(editor).includes('stream Front_Door'), 3000, 'the Result');
    expect(shownStream(editor), 'the attr: default is shown').to.equal('Front_Door');

    const builds = editor._builds.builds;
    editor.hass = house(editor.hass.states['camera.front'], 'on');
    await settle(4);
    expect(editor._builds.builds, 'a lamp switching on builds nothing').to.equal(builds);

    editor.hass = house('Back_Door', 'on');
    await until(() => yaml(editor).includes('stream Back_Door'), 3000, 'the Result after the camera changed');
    expect(shownStream(editor), 'the attr: default follows the camera').to.equal('Back_Door');

    // Typed into, the Result waits for the typing to stop before it builds.
    editor.setConfig({
      type: 'custom:decluttering-card-plus',
      template: 'cam',
      variables: [{ camera: 'camera.front' }, { stream: 'first' }],
    });
    await settle(2);
    expect(yaml(editor), 'the last Result is shown while typing').to.include('stream Back_Door');
    await until(() => yaml(editor).includes('stream first'), 3000, 'the Result once the typing stopped');

    setPreviewPaused(true);
    await settle(4);
    const before = editor._builds.last('result');
    editor.setConfig({
      type: 'custom:decluttering-card-plus',
      template: 'cam',
      variables: [{ camera: 'camera.front' }, { stream: 'typed' }],
    });
    await settle(4);
    expect(yaml(editor), 'no Result while paused').to.equal('');
    expect(editor._builds.last('result') === before, 'the Result was not built while paused').to.equal(true);
    setPreviewPaused(false);
    await until(() => yaml(editor).includes('stream typed'), 3000, 'the Result once resumed');
    editor.remove();
  });
});

/*
 * #488: the "What it builds" panel starts folded to its header row, `editor_hide: preview`
 * leaves it out, and a held preview is said at the top of the editor either way.
 */
describe('the What it builds panel (#488)', () => {
  const mount = (template: Record<string, unknown>, variables?: unknown[]): any => {
    const lovelace = stubLovelace({ decluttering_templates: { t: template }, views: [{ cards: [] }] });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    editor.hass = stubHass({});
    editor.lovelace = lovelace.config;
    editor.setConfig({ type: 'custom:decluttering-card-plus', template: 't', ...(variables ? { variables } : {}) });
    document.body.appendChild(editor);
    return editor;
  };
  const shadow = (editor: any, selector: string): any => editor.shadowRoot?.querySelector(selector);
  const held = (editor: any): string => shadow(editor, 'ha-alert.preview-held')?.textContent.trim() ?? '';
  const heldButtons = (editor: any): any[] => [
    ...(shadow(editor, 'ha-alert.preview-held')?.querySelectorAll('ha-button') ?? []),
  ];
  const plain = { card: { type: 'markdown', content: 'hi [[who]]' }, default: [{ who: 'there' }] };

  it('starts folded to its header, and opens and folds again by hand', async () => {
    const editor = mount(plain);
    try {
      await until(() => !!shadow(editor, 'ha-expansion-panel.preview'), 3000, 'the panel');
      const panel = shadow(editor, 'ha-expansion-panel.preview');
      expect(panel.expanded, 'folded').to.equal(false);
      expect(panel.textContent, 'the header is there').to.include('What it builds');
      expect(shadow(editor, 'pre.yaml'), 'nothing inside is made').to.equal(null);
      expect(shadow(editor, '.preview-actions'), 'nor its buttons').to.equal(null);
      expect(held(editor), 'nothing held, no banner').to.equal('');
      panel.dispatchEvent(new CustomEvent('expanded-changed', { detail: { expanded: true } }));
      await until(() => !!shadow(editor, 'pre.yaml'), 2000, 'the YAML once opened');
      expect(shadow(editor, 'pre.yaml').textContent).to.include('hi there');
      expect(shadow(editor, 'ha-expansion-panel.preview').expanded, 'open').to.equal(true);
      expect(shadow(editor, '.preview-actions').textContent, 'Pause and Copy with it').to.include('Copy');
      shadow(editor, 'ha-expansion-panel.preview').dispatchEvent(
        new CustomEvent('expanded-changed', { detail: { expanded: false } }),
      );
      await until(() => !shadow(editor, 'pre.yaml'), 2000, 'folded again');
    } finally {
      editor.remove();
    }
  });

  it('editor_hide: preview leaves the panel out', async () => {
    const editor = mount({ ...plain, editor_hide: 'preview' });
    try {
      await settle(6);
      expect(shadow(editor, 'ha-expansion-panel.preview'), 'no panel').to.equal(null);
    } finally {
      editor.remove();
    }
  });

  it('a paused preview is said at the top, folded or left out, and Resume there resumes it', async () => {
    for (const template of [plain, { ...plain, editor_hide: ['preview'] }]) {
      const editor = mount(template);
      try {
        await settle(4);
        expect(held(editor), 'no banner before the pause').to.equal('');
        setPreviewPaused(true);
        await until(() => held(editor).includes('paused'), 2000, 'the paused banner');
        const first = editor.shadowRoot.querySelector('ha-alert, ha-expansion-panel, .description');
        expect(first?.classList.contains('preview-held'), 'at the top of the form').to.equal(true);
        const labels = heldButtons(editor).map((each) => each.textContent.trim());
        expect(labels).to.deep.equal(['Resume preview', 'Render now']);
        heldButtons(editor)[0].click();
        await until(() => held(editor) === '', 2000, 'the banner gone once resumed');
      } finally {
        setPreviewPaused(false);
        editor.remove();
      }
    }
  });

  it('a required variable left unset holds the preview: the status line says so, and Show offers Render now', async () => {
    const editor = mount({
      variables: [{ name: 'who', required: true, selector: { text: {} } }],
      card: { type: 'markdown', content: 'hi [[who]]' },
    });
    try {
      await until(() => !!shadow(editor, '.status'), 3000, 'the status line');
      expect(shadow(editor, '.status-text').textContent.trim()).to.equal('1 variable to fill');
      expect(held(editor), 'no banner at the top').to.equal('');
      shadow(editor, '.status-toggle').click();
      await until(() => held(editor).includes('[[who]]'), 3000, 'the required banner');
      expect(heldButtons(editor).map((each) => each.textContent.trim())).to.deep.equal(['Render now']);
    } finally {
      editor.remove();
    }
  });
});

/*
 * The first run: the picker's stub names no template, so a card just added opens on choosing
 * one - in its preview and in its editor - instead of on an error about a missing template.
 */
describe('a card added from the picker', () => {
  const STUB_TYPE = 'custom:decluttering-card-plus';
  const shadow = (el: any, selector: string): any => el.shadowRoot?.querySelector(selector);

  it('the stub names no template', () => {
    const card = customElements.get('decluttering-card-plus') as any;
    expect(card.getStubConfig()).to.deep.equal({ type: STUB_TYPE });
  });

  it('previewed in the edit dialog, it asks for a template instead of an error', async () => {
    stubLovelace({ views: [{ cards: [] }] });
    // Open first, as Home Assistant has it: the preview is configured before it is placed.
    const dialog = document.createElement('hui-dialog-edit-card');
    document.body.appendChild(dialog);
    const el = document.createElement('decluttering-card-plus') as any;
    el.setConfig({ type: STUB_TYPE });
    el.hass = stubHass({});
    dialog.appendChild(el);
    try {
      await until(() => !!shadow(el, '.choosing'), 2000, 'the prompt');
      expect(shadow(el, '.choosing').textContent.trim()).to.equal('Pick a template to see the card.');
      expect(shadow(el, 'ha-alert, .error-card'), 'no error').to.equal(null);
    } finally {
      dialog.remove();
    }
  });

  it('outside the edit dialog a card with no template is the error it always was', () => {
    stubLovelace({ views: [{ cards: [] }] });
    const el = document.createElement('decluttering-card-plus') as any;
    let thrown = '';
    try {
      el.setConfig({ type: STUB_TYPE });
    } catch (err) {
      thrown = String((err as Error).message);
    }
    expect(thrown).to.equal('Missing template object in your config');
  });

  const editorFor = (config: Record<string, unknown>, templates?: Record<string, unknown>): any => {
    const lovelace = stubLovelace({
      ...(templates ? { decluttering_templates: templates } : {}),
      views: [{ cards: [] }],
    });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    editor.hass = stubHass({});
    editor.lovelace = lovelace.config;
    editor.setConfig(config);
    document.body.appendChild(editor);
    return editor;
  };

  it('on a dashboard with no templates the editor opens on the empty state, with no error', async () => {
    const editor = editorFor({ type: STUB_TYPE });
    try {
      await until(() => !!shadow(editor, '.first-run-empty'), 3000, 'the empty state');
      expect(shadow(editor, '.first-run-empty h3').textContent.trim()).to.equal('No templates on this dashboard yet');
      const buttons = [...shadow(editor, '.first-run-empty').querySelectorAll('ha-button')].map((each: any) =>
        each.textContent.trim(),
      );
      expect(buttons[0]).to.equal('Browse templates');
      expect(editor.shadowRoot.textContent, 'no missing-template error').not.to.include('No template exists');
      const starters = [...editor.shadowRoot.querySelectorAll('.starter-name')].map((each: any) =>
        each.textContent.trim(),
      );
      expect(starters, 'the starter library offered').to.include('room_light_tile');
      expect(shadow(editor, 'ha-expansion-panel.advanced'), 'nothing else yet').to.equal(null);
    } finally {
      editor.remove();
    }
  });

  it('with templates to pick, the picker is all there is, still with no error', async () => {
    const editor = editorFor({ type: STUB_TYPE }, { t: { card: { type: 'markdown', content: 'x' } } });
    try {
      await settle(6);
      expect(shadow(editor, '.picker'), 'the picker').not.to.equal(null);
      expect(shadow(editor, '.first-run-empty'), 'no empty state').to.equal(null);
      expect(editor.shadowRoot.textContent).not.to.include('No template exists');
    } finally {
      editor.remove();
    }
  });

  it('a template name that is not there still says so', async () => {
    const editor = editorFor({ type: STUB_TYPE, template: 'nowhere' }, { t: { card: { type: 'markdown' } } });
    try {
      await settle(6);
      expect(shadow(editor, '.first-run-empty'), 'no empty state').to.equal(null);
      // No picker element in this page, so the plain dropdown says it in an alert below.
      expect(editor.shadowRoot.textContent).to.include('No template exists with this name');
    } finally {
      editor.remove();
    }
  });

  it('Browse templates opens the gallery without the shared store', async () => {
    const editor = editorFor({ type: STUB_TYPE });
    try {
      await until(() => !!shadow(editor, '.first-run-empty ha-button'), 3000, 'the button');
      shadow(editor, '.first-run-empty ha-button').click();
      await until(() => !!shadow(editor, 'decluttering-card-plus-gallery'), 2000, 'the gallery');
      const gallery = shadow(editor, 'decluttering-card-plus-gallery');
      await settle(2);
      const tabs = [...gallery.shadowRoot.querySelectorAll('[role="tab"]')].map((each: any) => each.textContent.trim());
      expect(tabs.length).to.equal(2);
      expect(tabs[0]).to.include('Starter library');
    } finally {
      editor.remove();
    }
  });
});

/*
 * template_by_domain started from the form: a switch in the Repeat section turns the table on
 * with the card's template as what anything else uses, and off again after asking. A mapping
 * the table cannot read keeps the alert that sends it to the code editor.
 */
describe('choosing the template by domain from the form', () => {
  const tile = { card: { type: 'tile', entity: '[[entity]]' } };
  const mount = (config: Record<string, unknown>): any => {
    const lovelace = stubLovelace({
      decluttering_templates: { room_tile: tile, switch_tile: tile },
      views: [{ cards: [] }],
    });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    editor.hass = stubHass({ 'light.sim_kitchen': 'on', 'switch.sim_fan': 'off' });
    editor.lovelace = lovelace.config;
    editor.setConfig({ type: 'custom:decluttering-card-plus', ...config });
    document.body.appendChild(editor);
    return editor;
  };
  const shadow = (editor: any, selector: string): any => editor.shadowRoot?.querySelector(selector);
  const flip = (editor: any, on: boolean): void =>
    shadow(editor, 'ha-form.by-domain-switch').dispatchEvent(
      new CustomEvent('value-changed', { detail: { value: { by_domain: on } }, bubbles: true, composed: true }),
    );

  it('is off with no mapping, and on it starts one from the template', async () => {
    const editor = mount({ template: 'room_tile', variables: [{ entity: 'light.sim_kitchen' }] });
    try {
      await until(() => !!shadow(editor, '.repeat ha-form.by-domain-switch'), 3000, 'the switch');
      expect(shadow(editor, 'ha-form.by-domain-switch').data).to.deep.equal({ by_domain: false });
      expect(shadow(editor, '.by-domain'), 'no table yet').to.equal(null);
      let config: any;
      editor.addEventListener('config-changed', (ev: CustomEvent) => (config = ev.detail.config), { once: true });
      flip(editor, true);
      expect(config).to.deep.equal({
        type: 'custom:decluttering-card-plus',
        variables: [{ entity: 'light.sim_kitchen' }],
        template_by_domain: { default: 'room_tile' },
      });
      editor.setConfig(config);
      await until(() => !!shadow(editor, '.repeat .by-domain'), 3000, 'the table under the switch');
      expect(shadow(editor, '.by-domain .bd-default').textContent.trim()).to.equal('Anything else');
    } finally {
      editor.remove();
    }
  });

  it('turned off, it asks first, and only then goes back to one template', async () => {
    const editor = mount({ template_by_domain: { switch: 'switch_tile', default: 'room_tile' } });
    try {
      await until(() => !!shadow(editor, '.by-domain'), 3000, 'the table');
      let fired = 0;
      let config: any;
      editor.addEventListener('config-changed', (ev: CustomEvent) => {
        fired += 1;
        config = ev.detail.config;
      });
      flip(editor, false);
      await settle(2);
      expect(fired, 'nothing changed yet').to.equal(0);
      expect(!!shadow(editor, '.by-domain-off'), 'it asks').to.equal(true);
      expect(shadow(editor, 'ha-form.by-domain-switch').data, 'still on').to.deep.equal({ by_domain: true });
      const [, keep] = [...shadow(editor, '.by-domain-off').querySelectorAll('ha-button')];
      keep.click();
      await settle(2);
      expect(shadow(editor, '.by-domain-off'), 'kept').to.equal(null);
      expect(fired).to.equal(0);
      flip(editor, false);
      await settle(2);
      shadow(editor, '.by-domain-off ha-button').click();
      expect(config).to.deep.equal({ type: 'custom:decluttering-card-plus', template: 'room_tile' });
    } finally {
      editor.remove();
    }
  });

  it('a mapping the table cannot read keeps the code-editor alert', async () => {
    const editor = mount({ template_by_domain: { light: { nested: true }, default: 'room_tile' } });
    try {
      await until(() => !!shadow(editor, 'ha-form.by-domain-switch'), 3000, 'the switch');
      expect(shadow(editor, 'ha-form.by-domain-switch').data).to.deep.equal({ by_domain: true });
      expect(shadow(editor, '.by-domain'), 'no table').to.equal(null);
      const alerts = [...editor.shadowRoot.querySelectorAll('ha-alert')].map((each: any) => each.textContent);
      expect(alerts.some((text: string) => text.includes('change the mapping in the code editor'))).to.equal(true);
    } finally {
      editor.remove();
    }
  });
});

/*
 * The editor's order (UX pass): the picker, then the variables with how many required ones
 * are set, then the preview with one status line, then Advanced holding the rest - Repeat
 * among it unless the card repeats.
 */
describe('the editor order', () => {
  const template = {
    variables: [
      { name: 'entity', required: true, selector: { entity: {} } },
      { name: 'name', required: true, selector: { text: {} } },
      { name: 'icon', selector: { icon: {} } },
    ],
    card: { type: 'tile', entity: '[[entity]]', name: '[[name]]' },
  };
  const mount = (config: Record<string, unknown>): any => {
    const lovelace = stubLovelace({ decluttering_templates: { room_tile: template }, views: [{ cards: [] }] });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    editor.hass = stubHass({ 'light.sim_kitchen': 'on' });
    editor.lovelace = lovelace.config;
    editor.setConfig({ type: 'custom:decluttering-card-plus', template: 'room_tile', ...config });
    document.body.appendChild(editor);
    return editor;
  };
  const shadow = (editor: any, selector: string): any => editor.shadowRoot?.querySelector(selector);
  // The top-level blocks in the order they are drawn.
  const order = (editor: any): string[] =>
    [
      ...editor.shadowRoot.querySelectorAll(
        '.picker, section.variables, ha-expansion-panel.preview, .status, ha-expansion-panel.advanced',
      ),
    ].map((each: any) =>
      each.classList[0] === 'picker'
        ? 'picker'
        : each.localName === 'section'
          ? 'variables'
          : each.classList.contains('preview')
            ? 'preview'
            : each.classList.contains('status')
              ? 'status'
              : 'advanced',
    );

  it('picker, variables, preview, status, Advanced', async () => {
    const editor = mount({ variables: [{ entity: 'light.sim_kitchen' }] });
    try {
      await until(() => !!shadow(editor, 'ha-expansion-panel.advanced'), 3000, 'the editor');
      expect(order(editor)).to.deep.equal(['picker', 'variables', 'preview', 'status', 'advanced']);
    } finally {
      editor.remove();
    }
  });

  it('counts the required variables set, and the bar follows', async () => {
    const editor = mount({ variables: [{ entity: 'light.sim_kitchen' }] });
    try {
      await until(() => !!shadow(editor, '.variables .counter'), 3000, 'the counter');
      expect(shadow(editor, '.variables .counter').textContent.trim()).to.equal('1 of 2 required set');
      expect(shadow(editor, '.progress').getAttribute('aria-valuenow')).to.equal('1');
      expect(shadow(editor, '.status-text').textContent.trim()).to.include('1 variable to fill');
      expect(shadow(editor, '.required-line').dataset.required, 'the empty one says so').to.equal('name');
      expect(shadow(editor, '.required-line').textContent.trim()).to.equal('Required by room_tile');
      editor.setConfig({
        type: 'custom:decluttering-card-plus',
        template: 'room_tile',
        variables: [{ entity: 'light.sim_kitchen' }, { name: 'Kitchen' }],
      });
      await until(
        () => shadow(editor, '.variables .counter')?.textContent.trim() === '2 of 2 required set',
        3000,
        'all set',
      );
      expect(shadow(editor, '.status'), 'nothing left to say').to.equal(null);
    } finally {
      editor.remove();
    }
  });

  it('Repeat sits in Advanced for a single card, and out in the open once the card repeats', async () => {
    const single = mount({ variables: [{ entity: 'light.sim_kitchen' }, { name: 'K' }] });
    try {
      await until(() => !!shadow(single, 'ha-expansion-panel.advanced'), 3000, 'the editor');
      expect(!!shadow(single, 'ha-expansion-panel.advanced .repeat'), 'inside Advanced').to.equal(true);
    } finally {
      single.remove();
    }
    const repeating = mount({ for_each: [{ entity: 'light.sim_kitchen', name: 'K' }] });
    try {
      await until(() => !!shadow(repeating, '.repeat'), 3000, 'the repeat');
      expect(!!shadow(repeating, 'ha-expansion-panel.advanced .repeat'), 'not inside Advanced').to.equal(false);
    } finally {
      repeating.remove();
    }
  });
});
