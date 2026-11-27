/*
 * The card across rebuilds, as the 2026-11 review found it going wrong: an error a registry
 * repeat had just said wiped out, an old config built over a newer one, a rebuild made after
 * the card had left the page, and a mistyped custom card type that was never said.
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
const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe('review: runtime', () => {
  it('a repeat over the registry keeps the error a stopping check said', async () => {
    stubLovelace({
      decluttering_templates: {
        t: {
          checks: [
            {
              name: 'No camera',
              condition: '[[camera|exists]]',
              fail_on: false,
              level: 'error',
              continue_rendering: false,
              message: 'The camera [[camera]] is not there.',
            },
          ],
          card: { type: 'markdown', content: '[[entity]]' },
        },
      },
      views: [{ cards: [] }],
    });
    const hass = stubHass({ 'light.a': 'on' });
    hass.entities = { 'light.a': { entity_id: 'light.a' } };
    const el = card(
      { template: 't', variables: [{ camera: 'camera.gone' }], for_each_from: { entities: true, domain: 'light' } },
      hass,
    );
    document.body.appendChild(el);
    await until(
      () => (el.shadowRoot?.querySelector('ha-alert[alert-type="error"]')?.textContent ?? '').includes('camera.gone'),
      2000,
      'the error the check said',
    );
    expect(String(el._error)).to.include('The camera camera.gone is not there.');
  });

  it('a config whose template is missing is not replaced by the card before it at a registry change', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: 'was [[entity|friendly_name]]' } } },
      views: [{ cards: [] }],
    });
    const hass = stubHass({ 'light.a': 'on' });
    const el = card({ template: 't', variables: [{ entity: 'light.a' }] }, hass);
    document.body.appendChild(el);
    await until(() => inner(el)?.config?.content === 'was a', 2000, 'the first card');
    el.setConfig({ template: 'review_gone' });
    el.hass = hass;
    await until(() => String(el._error ?? '').includes('review_gone'), 2000, 'the missing template said');
    // The registry moves: an entity renamed, the labels landing.
    el.hass = { ...hass, entities: { 'light.a': { entity_id: 'light.a' } } };
    await settle(4);
    expect(String(el._error ?? ''), 'the error still stands').to.include('review_gone');
  });

  it('a template fetched for a config the card no longer has is not built over the new one', async () => {
    stubLovelace({
      decluttering_templates_from: ['review-far'],
      decluttering_templates: { near: { card: { type: 'markdown', content: 'near' } } },
      views: [{ cards: [] }],
    });
    let release: (config: unknown) => void = () => undefined;
    const far = new Promise((resolve) => (release = resolve));
    const hass = stubHass();
    hass.callWS = async (message: any) =>
      message?.type === 'lovelace/config' && message.url_path === 'review-far' ? far : [];
    const el = card({ template: 'far' }, hass);
    document.body.appendChild(el);
    await settle();
    el.setConfig({ template: 'near' });
    await until(() => inner(el)?.config?.content === 'near', 2000, 'the new config built');
    release({ decluttering_templates: { far: { card: { type: 'markdown', content: 'far' } } }, views: [] });
    await settle(6);
    await wait(50);
    expect(inner(el)?.config?.content).to.equal('near');
    expect(el._error, 'and no error from the old one').to.equal(undefined);
  });

  it('a rebuild waiting out a burst is not made off the page, and is made once the card is back', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: 'x [[sensor.review|state]]' } } },
      views: [{ cards: [] }],
    });
    const hass = stubHass({ 'sensor.review': '1' });
    // Only the state moves: the registries stay the objects they were, as Home Assistant keeps them.
    const moved = { ...hass, states: stubHass({ 'sensor.review': '2' }).states };
    const el = card({ template: 't', rebuild_on: 'sensor.review' }, hass);
    document.body.appendChild(el);
    await until(() => el._thingConfig?.content === 'x 1', 2000, 'the first build');
    el.hass = moved;
    el.remove();
    await wait(450);
    expect(el._thingConfig?.content, 'not rebuilt while off the page').to.equal('x 1');
    document.body.appendChild(el);
    el.hass = { ...moved };
    await until(() => el._thingConfig?.content === 'x 2', 2000, 'the rebuild once it is back');
  });

  it('a custom card type no element can have is said to be missing', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'custom:reviewnohyphen' } } },
      views: [{ cards: [] }],
    });
    const el = card({ template: 't' }, stubHass());
    document.body.appendChild(el);
    await until(() => String(el._error ?? '').includes('custom:reviewnohyphen'), 2000, 'the missing type said');
  });
});
