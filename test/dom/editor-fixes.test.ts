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
  const mount = (variables: unknown): any => {
    const lovelace = stubLovelace({
      decluttering_templates: { lamp: template },
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
  const helperOf = (editor: any, name: string): string | undefined => {
    for (const form of editor.shadowRoot?.querySelectorAll('.declared-field ha-form') ?? []) {
      const entry = (form as any).schema?.[0];
      if (entry?.name === `variable:${name}`) return entry.helper;
    }
    return undefined;
  };

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
    expect(helperOf(editor, 'room'), 'a dashboard default says so').to.equal('Default from the dashboard: Den');
    expect(
      editor.shadowRoot.querySelector('ha-expansion-panel.declared-group [data-variable="colour"]'),
      'the grouped Reset sits in its group',
    ).to.not.equal(null);
    expect(helperOf(editor, 'icon'), 'says where the default is from').to.equal(
      'Default from the template: mdi:lightbulb',
    );
    expect(helperOf(editor, 'title'), 'a computed default is worked out').to.equal(
      'Default from the template: Hall lights (worked out from [[room]] lights)',
    );
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
