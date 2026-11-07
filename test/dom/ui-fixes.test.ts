/*
 * The dashboard-side fixes the everything-left ha-dev round found: rows and badges keep the
 * plain alert, Open template opens from the error card, the preview frame's Both mode, and
 * the health badge in the badge picker.
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

// A host element with a shadow root and a div in it, as an entities card or a picker holds its children.
function shadowHost(tag: string): HTMLElement {
  const host = document.createElement(tag);
  const holder = document.createElement('div');
  host.attachShadow({ mode: 'open' }).appendChild(holder);
  document.body.appendChild(host);
  return holder;
}

const TEMPLATES = {
  strict_row: { strict: true, row: { entity: '[[e]]' } },
  strict_badge: { strict: true, badge: { type: 'entity', entity: '[[e]]' } },
  strict_card: { strict: true, card: { type: 'markdown', content: '[[e]]' } },
};

const alertOnly = async (el: any): Promise<void> => {
  await until(() => !!el.shadowRoot?.querySelector('ha-alert, .error-card'), 3000, 'the error');
  await settle();
  expect(!!el.shadowRoot.querySelector('.error-card'), 'no error card').to.equal(false);
  expect(!!el.shadowRoot.querySelector('ha-alert'), 'the alert').to.equal(true);
};

describe('errors on rows and badges', () => {
  it('a strict row in an entities card keeps the alert', async () => {
    stubLovelace({ decluttering_templates: TEMPLATES, views: [{ cards: [] }] });
    const el = card({ template: 'strict_row' }, stubHass());
    shadowHost('hui-entities-card').appendChild(el);
    await alertOnly(el);
  });

  it('a strict badge keeps the alert', async () => {
    stubLovelace({ decluttering_templates: TEMPLATES, views: [{ cards: [] }] });
    const wrapper = document.createElement('hui-badge');
    document.body.appendChild(wrapper);
    const el = card({ template: 'strict_badge' }, stubHass());
    wrapper.appendChild(el);
    await alertOnly(el);
  });

  it('a missing template in a row keeps the alert', async () => {
    stubLovelace({ decluttering_templates: TEMPLATES, views: [{ cards: [] }] });
    const el = card({ template: 'nope_row' }, stubHass());
    shadowHost('hui-entities-card').appendChild(el);
    await alertOnly(el);
  });

  it('a missing template in a simple-entity row keeps the alert', async () => {
    stubLovelace({ decluttering_templates: TEMPLATES, views: [{ cards: [] }] });
    const el = card({ template: 'nope_row' }, stubHass());
    shadowHost('hui-conditional-row').appendChild(el);
    await alertOnly(el);
  });

  it('a missing template on a picture-elements card keeps the alert', async () => {
    stubLovelace({ decluttering_templates: TEMPLATES, views: [{ cards: [] }] });
    const el = card({ template: 'nope_element' }, stubHass());
    shadowHost('hui-picture-elements-card').appendChild(el);
    await alertOnly(el);
  });

  it('a missing template in a badge keeps the alert', async () => {
    stubLovelace({ decluttering_templates: TEMPLATES, views: [{ cards: [] }] });
    const wrapper = document.createElement('hui-badge');
    document.body.appendChild(wrapper);
    const el = card({ template: 'nope_badge' }, stubHass());
    wrapper.appendChild(el);
    await alertOnly(el);
  });

  it('a card still gets the error card, missing or strict', async () => {
    stubLovelace({ decluttering_templates: TEMPLATES, views: [{ cards: [] }] });
    for (const template of ['nope_card', 'strict_card']) {
      const wrapper = document.createElement('hui-card');
      document.body.appendChild(wrapper);
      const el = card({ template }, stubHass());
      wrapper.appendChild(el);
      await until(() => !!el.shadowRoot?.querySelector('.error-card'), 3000, `the error card for ${template}`);
    }
  });
});

describe('error card Open template', () => {
  it('opens the editor for a template declared under the root key', async () => {
    stubLovelace({
      decluttering_templates: { uses_custom: { card: { type: 'custom:not-a-real-card-xyz' } } },
      views: [{ cards: [] }],
    });
    const el = card({ template: 'uses_custom' }, stubHass());
    el.preview = true;
    document.body.appendChild(el);
    const open = (): any =>
      [...(el.shadowRoot?.querySelectorAll('.error-card ha-button') ?? [])].find((b: any) =>
        /Open template/.test(b.textContent),
      );
    await until(() => !!open(), 6000, 'the Open template button');
    open().click();
    await until(
      () => !!el.shadowRoot.querySelector('ha-dialog decluttering-template-plus-editor'),
      3000,
      'the template dialog',
    );
    expect(!!el.shadowRoot.querySelector('.error-card'), 'the error card stays under it').to.equal(true);
  });
});

describe('preview frame Both', () => {
  async function frame(width: number): Promise<any> {
    const box = document.createElement('div');
    box.style.width = `${width}px`;
    const el = document.createElement('decluttering-preview-frame') as any;
    el.hass = { ...stubHass(), themes: { default_theme: 'default', themes: {}, darkMode: false } };
    el.config = { type: 'markdown', content: 'x' };
    box.appendChild(el);
    document.body.appendChild(box);
    await el.updateComplete;
    await settle();
    return el;
  }
  const press = async (el: any, label: string): Promise<void> => {
    const button = [...el.shadowRoot.querySelectorAll('.seg button')].find(
      (b: any) => b.textContent.trim() === label,
    ) as any;
    button.click();
    await el.updateComplete;
    await settle(4);
  };
  const stages = (el: any): DOMRect[] =>
    [...el.shadowRoot.querySelectorAll('.stage')].map((s: any) => s.getBoundingClientRect());

  it('at Desktop each stage fills its half', async () => {
    const el = await frame(900);
    await press(el, 'Both');
    const [light, dark] = stages(el);
    const half = (900 - 12) / 2;
    expect(Math.abs(light.width - half), `light ${light.width} of ${half}`).to.be.below(2);
    expect(Math.abs(dark.width - half), `dark ${dark.width} of ${half}`).to.be.below(2);
  });

  for (const [label, asked] of [
    ['Phone', 388],
    ['Tablet', 768],
  ] as const) {
    it(`at ${label} each stage is capped to its half, and the caption says so`, async () => {
      const el = await frame(700);
      await press(el, 'Both');
      await press(el, label);
      const box = el.getBoundingClientRect();
      for (const stage of stages(el)) {
        expect(stage.right, 'inside the frame').to.be.at.most(box.right + 0.5);
        expect(stage.width, 'no wider than half').to.be.at.most((700 - 12) / 2 + 0.5);
      }
      expect(stages(el)[0].right, 'side by side, not overlapping').to.be.at.most(stages(el)[1].left);
      await until(
        () => new RegExp(`asked for ${asked}`).test(el.shadowRoot.querySelector('.caption')?.textContent ?? ''),
        2000,
        'the narrower caption',
      );
    });
  }

  it('at Phone in a wide frame the stages keep the phone width', async () => {
    const el = await frame(1100);
    await press(el, 'Both');
    await press(el, 'Phone');
    await until(() => el.shadowRoot.querySelector('.caption')?.textContent.trim() === '388 px', 2000, 'caption');
  });
});

describe('health badge in the badge picker', () => {
  it('previews as the badge, not the card', async () => {
    stubLovelace({ views: [{ cards: [] }] });
    const holder = shadowHost('hui-badge-picker');
    const badge = document.createElement('decluttering-card-plus-health-card') as any;
    badge.setConfig({ type: 'custom:decluttering-card-plus-health-card' });
    badge.hass = stubHass();
    holder.appendChild(badge);
    await until(() => !!badge.shadowRoot?.querySelector('.badge, ha-card'), 3000, 'the preview');
    expect(!!badge.shadowRoot.querySelector('.badge'), 'the badge').to.equal(true);
    expect(!!badge.shadowRoot.querySelector('ha-card'), 'not the card').to.equal(false);
  });

  it('in the card picker it is still the card', async () => {
    stubLovelace({ views: [{ cards: [] }] });
    const holder = shadowHost('hui-card-picker');
    const health = document.createElement('decluttering-card-plus-health-card') as any;
    health.setConfig({ type: 'custom:decluttering-card-plus-health-card' });
    health.hass = stubHass();
    holder.appendChild(health);
    await until(() => !!health.shadowRoot?.querySelector('ha-card'), 3000, 'the card');
  });
});
