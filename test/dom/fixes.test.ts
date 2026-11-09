/*
 * What the first round on the dev Home Assistant found (ideas 42, 47, 49, 50), each pinned
 * against a rendered element so it cannot come back quietly.
 */
import { describe, it, expect, settle, until } from './runner';
import { stubHass, stubLovelace } from './stubs';

/* eslint-disable @typescript-eslint/no-explicit-any */

const CARD = 'decluttering-card-plus';

function card(config: Record<string, any>, hass: any): any {
  const element = document.createElement(CARD) as any;
  element.setConfig(config);
  element.hass = hass;
  return element;
}

const inner = (element: any): any => element.shadowRoot?.querySelector('hui-card, hui-badge');
const shadowText = (element: any): string => element.shadowRoot?.textContent ?? '';

describe('edit-mode chip', () => {
  it('stays while the built YAML is showing, so the card can be shown again (idea 47)', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: 'hello' } } },
      views: [{ cards: [] }],
    });
    const el = card({ template: 't' }, stubHass());
    el.preview = true;
    document.body.appendChild(el);
    await until(() => !!el.shadowRoot?.querySelector('decluttering-card-plus-chip'), 2000, 'the chip');
    const chip = el.shadowRoot.querySelector('decluttering-card-plus-chip');
    chip.dispatchEvent(new CustomEvent('dcp-chip', { detail: { action: 'show' } }));
    await settle();
    expect(!!el.shadowRoot.querySelector('.debug pre'), 'the built YAML is showing').to.equal(true);
    const stillThere = el.shadowRoot.querySelector('decluttering-card-plus-chip');
    expect(!!stillThere, 'the chip is still drawn').to.equal(true);
    expect(stillThere.showing, 'and offers the card back').to.equal(true);
    stillThere.dispatchEvent(new CustomEvent('dcp-chip', { detail: { action: 'show' } }));
    await until(() => !!inner(el), 2000, 'the card again');
  });

  it('is not drawn on the card that defines the template', async () => {
    stubLovelace({ views: [{ cards: [] }] });
    const definer = document.createElement('decluttering-template-plus') as any;
    definer.setConfig({ template: 't', card: { type: 'markdown', content: 'hello' } });
    definer.hass = stubHass();
    definer.preview = true;
    document.body.appendChild(definer);
    await until(() => !!inner(definer), 2000, 'the template card');
    await settle();
    expect(!!definer.shadowRoot.querySelector('decluttering-card-plus-chip')).to.equal(false);
  });
});

describe('missing custom element', () => {
  it('gets the error card that names the type, with no on_error set (idea 49)', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'custom:nobody-installed-this-card' } } },
      views: [{ cards: [] }],
    });
    const el = card({ template: 't' }, stubHass());
    document.body.appendChild(el);
    await until(() => shadowText(el).includes('nobody-installed-this-card'), 6000, 'the error card');
    expect(shadowText(el)).to.include('t');
  });
});

describe('template_by_domain failures', () => {
  it('a template it names that is not there gets the error card, not a throw (idea 49)', async () => {
    stubLovelace({
      decluttering_templates: { lamp: { card: { type: 'markdown', content: 'lamp' } } },
      views: [{ cards: [] }],
    });
    const el = card(
      { template_by_domain: { light: 'lampp', default: 'lamp' }, variables: [{ entity: 'light.a' }] },
      stubHass({ 'light.a': 'on' }),
    );
    document.body.appendChild(el);
    await until(() => shadowText(el).includes('lampp'), 3000, 'the error card');
    expect(!!el.shadowRoot.querySelector('ha-card'), 'drawn as our error card').to.equal(true);
    expect(shadowText(el)).to.include('lamp');
  });

  it('no template for the domain and no default is said on the card, and on_error still stands in', async () => {
    stubLovelace({
      decluttering_templates: { lamp: { card: { type: 'markdown', content: 'lamp' } } },
      views: [{ cards: [] }],
    });
    const said = card({ template_by_domain: { light: 'lamp' }, variables: [{ entity: 'sun.sun' }] }, stubHass());
    document.body.appendChild(said);
    await until(() => !!said._error, 2000, 'the error');
    expect(said._error).to.include('sun');
    const covered = card(
      {
        template_by_domain: { light: 'lamp' },
        variables: [{ entity: 'sun.sun' }],
        on_error: { type: 'markdown', content: 'FALLBACK' },
      },
      stubHass(),
    );
    document.body.appendChild(covered);
    await until(() => inner(covered)?.config?.content === 'FALLBACK', 3000, 'the on_error card');
  });
});

describe('health badge', () => {
  it('reads edit mode off the hui-badge around it, so a clean badge comes back to be edited (idea 50)', async () => {
    stubLovelace({ views: [{ cards: [] }] });
    const wrapper = document.createElement('hui-badge') as any;
    document.body.appendChild(wrapper);
    const badge = document.createElement('decluttering-card-plus-health-card') as any;
    badge.setConfig({ type: 'custom:decluttering-card-plus-health-card', hide_when_clean: true });
    badge.hass = stubHass();
    wrapper.appendChild(badge);
    await until(() => badge.hasAttribute('hidden'), 3000, 'a clean badge to hide');
    wrapper.preview = true;
    wrapper.removeChild(badge);
    wrapper.appendChild(badge);
    await until(() => !badge.hasAttribute('hidden'), 3000, 'the badge back in edit mode');
  });
});

/*
 * #411: rebuild_on written on the template, with a placeholder filled from the card's
 * variables, lets the card read the entity's attribute and rebuild when it moves.
 */
describe('rebuild_on placeholders on the template (#411)', () => {
  const withCamera = (name: string, updated: string): any => {
    const hass = stubHass({ 'camera.front': 'idle' });
    hass.states['camera.front'].attributes.camera_name = name;
    hass.states['camera.front'].last_updated = updated;
    return hass;
  };
  const camera = {
    rebuild_on: '[[camera]]',
    variables: [{ name: 'camera' }, { name: 'stream', default: '[[camera|attr:camera_name]]' }],
    card: { type: 'markdown', content: 'stream [[stream]]' },
  };

  it('fills the attribute and follows it', async () => {
    stubLovelace({ decluttering_templates: { camera }, views: [{ cards: [] }] });
    const el = card({ template: 'camera', variables: [{ camera: 'camera.front' }] }, withCamera('Front_Door', '1'));
    document.body.appendChild(el);
    await until(() => inner(el)?.config?.content === 'stream Front_Door', 3000, 'the attribute');
    el.hass = withCamera('Back_Door', '2');
    await until(() => inner(el)?.config?.content === 'stream Back_Door', 3000, 'the rebuild');
    el.remove();
  });

  it('reads nothing when the template does not name the entity', async () => {
    const unlisted: Record<string, unknown> = { ...camera };
    delete unlisted.rebuild_on;
    stubLovelace({ decluttering_templates: { camera: unlisted }, views: [{ cards: [] }] });
    const el = card({ template: 'camera', variables: [{ camera: 'camera.front' }] }, withCamera('Front_Door', '1'));
    document.body.appendChild(el);
    await until(() => !!inner(el)?.config?.content, 3000, 'a build');
    expect(inner(el).config.content, 'left unfilled').not.to.contain('Front_Door');
    el.remove();
  });
});

/*
 * #411: a camera's access token is refreshed every few minutes, which moves its last_updated,
 * so a card reading the camera with attr: rebuilds. When that rebuild comes out the same, the
 * card inside is kept - a new one would reconnect the stream for nothing.
 */
describe('a rebuild that builds the same card (#411)', () => {
  const withCamera = (name: string, token: string, updated: string): any => {
    const hass = stubHass({ 'camera.front': 'idle' });
    hass.states['camera.front'].attributes.camera_name = name;
    hass.states['camera.front'].attributes.access_token = token;
    hass.states['camera.front'].last_updated = updated;
    return hass;
  };

  it('keeps the card inside, and replaces it once the build changes', async () => {
    stubLovelace({
      decluttering_templates: {
        camera: {
          variables: [{ name: 'camera' }, { name: 'stream', default: '[[camera|attr:camera_name]]' }],
          card: { type: 'markdown', content: 'stream [[stream]]' },
        },
      },
      views: [{ cards: [] }],
    });
    const el = card(
      { template: 'camera', rebuild_on: 'camera.front', variables: [{ camera: 'camera.front' }] },
      withCamera('Front_Door', 'a', '1'),
    );
    document.body.appendChild(el);
    await until(() => inner(el)?.config?.content === 'stream Front_Door', 3000, 'the first build');
    const first = inner(el);
    let builds = el._thingConfig;
    el.hass = withCamera('Front_Door', 'b', '2');
    // The rebuild runs after the debounce; it has run once the built config is a new object.
    await until(() => el._thingConfig !== builds, 3000, 'the rebuild');
    await settle(2);
    expect(inner(el) === first, 'the same card is kept').to.equal(true);
    builds = el._thingConfig;
    el.hass = withCamera('Back_Door', 'b', '3');
    await until(() => inner(el)?.config?.content === 'stream Back_Door', 3000, 'the changed build');
    expect(inner(el) === first, 'a changed build gets a new card').to.equal(false);
    el.remove();
  });
});

/*
 * #411, opt-in: a card that says what to watch compares only those parts of the state, so a
 * camera's token refresh - which moves last_updated and access_token - builds nothing. The
 * card above, which says nothing, still rebuilds on it.
 */
describe('rebuild_on that watches only what it reads (#411)', () => {
  const withCamera = (name: string, token: string, updated: string): any => {
    const hass = stubHass({ 'camera.front': 'idle' });
    hass.states['camera.front'].attributes.camera_name = name;
    hass.states['camera.front'].attributes.access_token = token;
    hass.states['camera.front'].last_updated = updated;
    return hass;
  };
  // Only the states move: a new registry on hass would rebuild the card for a reason of its own.
  const moved = (from: any, name: string, token: string, updated: string): any => ({
    ...from,
    states: withCamera(name, token, updated).states,
  });
  const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
  const camera = {
    variables: [{ name: 'camera' }, { name: 'stream', default: '[[camera|attr:camera_name]]' }],
    card: { type: 'markdown', content: 'stream [[stream]]' },
  };

  const follows = async (config: Record<string, any>, templates: Record<string, any>): Promise<void> => {
    stubLovelace({ decluttering_templates: templates, views: [{ cards: [] }] });
    const first = withCamera('Front_Door', 'a', '1');
    const el = card(config, first);
    document.body.appendChild(el);
    await until(() => inner(el)?.config?.content === 'stream Front_Door', 3000, 'the first build');
    await settle(2);
    const built = el._thingConfig;
    el.hass = moved(first, 'Front_Door', 'b', '2');
    // Past the debounce: a rebuild would have made a new built config by now.
    await wait(800);
    expect(el._thingConfig === built, 'a token refresh builds nothing').to.equal(true);
    el.hass = moved(first, 'Back_Door', 'b', '3');
    await until(() => inner(el)?.config?.content === 'stream Back_Door', 3000, 'the watched attribute');
    el.remove();
  };

  it('rebuild_on_watch: read on the card', async () => {
    await follows(
      {
        template: 'camera',
        rebuild_on: 'camera.front',
        rebuild_on_watch: 'read',
        variables: [{ camera: 'camera.front' }],
      },
      { camera },
    );
  });

  it('an entry with watch:, its entity a placeholder on the template', async () => {
    await follows(
      { template: 'camera', variables: [{ camera: 'camera.front' }] },
      { camera: { ...camera, rebuild_on: [{ entity: '[[camera]]', watch: ['state', 'camera_name'] }] } },
    );
  });

  it('rebuild_on_watch: read on the template', async () => {
    await follows(
      { template: 'camera', variables: [{ camera: 'camera.front' }] },
      { camera: { ...camera, rebuild_on: '[[camera]]', rebuild_on_watch: 'read' } },
    );
  });

  it('a card that says nothing still rebuilds on the refresh', async () => {
    stubLovelace({ decluttering_templates: { camera }, views: [{ cards: [] }] });
    const first = withCamera('Front_Door', 'a', '1');
    const el = card({ template: 'camera', rebuild_on: 'camera.front', variables: [{ camera: 'camera.front' }] }, first);
    document.body.appendChild(el);
    await until(() => inner(el)?.config?.content === 'stream Front_Door', 3000, 'the first build');
    await settle(2);
    const built = el._thingConfig;
    el.hass = moved(first, 'Front_Door', 'b', '2');
    await until(() => el._thingConfig !== built, 3000, 'the rebuild');
    el.remove();
  });
});
