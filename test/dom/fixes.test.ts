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
