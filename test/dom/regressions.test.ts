/*
 * The regressions that came back, each one line against a rendered element (idea 6):
 * v1.8.0 a hidden card kept its slot; v1.8.0 a badge stayed hidden in edit mode because
 * hui-badge never forwards preview; v1.10.0 masonry looped on card-updated per connect;
 * v1.10.0 section defaults did not reach the card; v1.15.0 a group whose cards all hide
 * did not hide itself.
 */
import { describe, it, expect, settle, until } from './runner';
import { stubHass, stubLovelace, stubSection } from './stubs';

/* eslint-disable @typescript-eslint/no-explicit-any */

const CARD = 'decluttering-card-plus';

function card(config: Record<string, any>, hass: any): any {
  const element = document.createElement(CARD) as any;
  element.setConfig(config);
  element.hass = hass;
  return element;
}

const inner = (element: any): any => element.shadowRoot?.querySelector('hui-card, hui-badge');

describe('hidden card', () => {
  it('gives up its slot when the card inside hides itself', async () => {
    stubLovelace({
      decluttering_templates: {
        t: {
          card: {
            type: 'markdown',
            content: 'x',
            visibility: [{ condition: 'state', entity: 'light.a', state: 'on' }],
          },
        },
      },
      views: [{ cards: [] }],
    });
    const el = card({ template: 't' }, stubHass({ 'light.a': 'off' }));
    document.body.appendChild(el);
    await until(() => !!inner(el), 2000, 'the wrapped card');
    await settle();
    expect(inner(el).hasAttribute('hidden'), 'the stub hid itself').to.equal(true);
    expect(el.classList.contains('child-card-hidden'), 'the wrapper noticed').to.equal(true);
    expect(getComputedStyle(el).display).to.equal('none');
  });

  it('takes its slot back when the card inside shows again', async () => {
    stubLovelace({
      decluttering_templates: {
        t: {
          card: {
            type: 'markdown',
            content: 'x',
            visibility: [{ condition: 'state', entity: 'light.a', state: 'on' }],
          },
        },
      },
      views: [{ cards: [] }],
    });
    const el = card({ template: 't' }, stubHass({ 'light.a': 'off' }));
    document.body.appendChild(el);
    await until(() => !!inner(el) && el.classList.contains('child-card-hidden'), 2000, 'hidden first');
    el.hass = stubHass({ 'light.a': 'on' });
    await until(() => !el.classList.contains('child-card-hidden'), 2000, 'shown again');
    expect(getComputedStyle(el).display).to.not.equal('none');
  });
});

describe('badge preview', () => {
  it('forwards preview to the badge inside, which hui-badge never does on its own', async () => {
    stubLovelace({
      decluttering_templates: {
        b: {
          badge: {
            type: 'entity',
            entity: 'light.a',
            visibility: [{ condition: 'state', entity: 'light.a', state: 'on' }],
          },
        },
      },
      views: [{ cards: [] }],
    });
    const el = card({ template: 'b' }, stubHass({ 'light.a': 'off' }));
    el.preview = true;
    document.body.appendChild(el);
    await until(() => !!inner(el), 2000, 'the wrapped badge');
    await settle();
    const badge = inner(el);
    expect(badge.localName).to.equal('hui-badge');
    expect(badge.preview, 'preview reached the badge').to.equal(true);
    expect(badge.hasAttribute('hidden'), 'so it is drawn in the editor').to.equal(false);
  });

  it('a badge outside a preview still hides', async () => {
    stubLovelace({
      decluttering_templates: {
        b: {
          badge: {
            type: 'entity',
            entity: 'light.a',
            visibility: [{ condition: 'state', entity: 'light.a', state: 'on' }],
          },
        },
      },
      views: [{ cards: [] }],
    });
    const el = card({ template: 'b' }, stubHass({ 'light.a': 'off' }));
    document.body.appendChild(el);
    await until(() => !!inner(el), 2000, 'the wrapped badge');
    await settle();
    expect(inner(el).hasAttribute('hidden')).to.equal(true);
  });
});

describe('section defaults', () => {
  it('reach a card once it is on the page inside its section', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: '[[name]]' } } },
      views: [{ type: 'sections', sections: [{ decluttering_defaults: [{ name: 'From the section' }], cards: [] }] }],
    });
    const section = stubSection(0, 0);
    const el = card({ template: 't' }, stubHass());
    section.appendChild(el);
    await until(() => inner(el)?.config?.content === 'From the section', 2000, 'the section default');
    expect(inner(el).config.content).to.equal('From the section');
  });

  it('the card itself still wins over the section', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: '[[name]]' } } },
      views: [{ type: 'sections', sections: [{ decluttering_defaults: [{ name: 'From the section' }], cards: [] }] }],
    });
    const section = stubSection(0, 0);
    const el = card({ template: 't', variables: [{ name: 'Mine' }] }, stubHass());
    section.appendChild(el);
    await until(() => !!inner(el)?.config?.content, 2000, 'a build');
    await settle();
    expect(inner(el).config.content).to.equal('Mine');
  });
});

describe('group', () => {
  it('hides itself when every card in it is hidden', async () => {
    stubLovelace({
      decluttering_templates: {
        g: {
          group: [
            { type: 'markdown', content: 'a', visibility: [{ condition: 'state', entity: 'light.a', state: 'on' }] },
            { type: 'markdown', content: 'b', visibility: [{ condition: 'state', entity: 'light.a', state: 'on' }] },
          ],
        },
      },
      views: [{ cards: [] }],
    });
    const el = card({ template: 'g' }, stubHass({ 'light.a': 'off' }));
    document.body.appendChild(el);
    await until(() => !!inner(el)?.querySelector('decluttering-card-plus-group'), 2000, 'the group');
    const group = inner(el).querySelector('decluttering-card-plus-group');
    await until(() => group.hasAttribute('hidden'), 2000, 'the group hiding');
    await settle();
    expect(inner(el).hasAttribute('hidden'), 'hui-card followed the group').to.equal(true);
    expect(el.classList.contains('child-card-hidden'), 'and the wrapper followed hui-card').to.equal(true);
  });

  it('stays when one card in it is shown', async () => {
    stubLovelace({
      decluttering_templates: {
        g: {
          group: [
            { type: 'markdown', content: 'a', visibility: [{ condition: 'state', entity: 'light.a', state: 'on' }] },
            { type: 'markdown', content: 'b' },
          ],
        },
      },
      views: [{ cards: [] }],
    });
    const el = card({ template: 'g' }, stubHass({ 'light.a': 'off' }));
    document.body.appendChild(el);
    await until(() => !!inner(el)?.querySelector('decluttering-card-plus-group'), 2000, 'the group');
    await settle(6);
    expect(inner(el).querySelector('decluttering-card-plus-group').hasAttribute('hidden')).to.equal(false);
    expect(el.classList.contains('child-card-hidden')).to.equal(false);
  });
});

describe('card-updated', () => {
  it('fires once per wrapped card, not once per connect', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: 'x' } } },
      views: [{ type: 'sections', sections: [{ cards: [] }] }],
    });
    const section = stubSection(0, 0);
    let fired = 0;
    section.addEventListener('card-updated', () => {
      fired += 1;
    });
    const el = card({ template: 't' }, stubHass());
    section.appendChild(el);
    await until(() => !!inner(el), 2000, 'the wrapped card');
    await settle(6);
    expect(fired, 'once after the first build').to.equal(1);
    // A masonry view reconnects every card when it lays its columns out again.
    section.removeChild(el);
    await settle(2);
    section.appendChild(el);
    await settle(6);
    section.removeChild(el);
    section.appendChild(el);
    await settle(6);
    expect(fired, 'still once after two reconnects').to.equal(1);
  });

  it('is not fired outside a section at all', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: 'x' } } },
      views: [{ cards: [] }],
    });
    let fired = 0;
    document.body.addEventListener('card-updated', () => {
      fired += 1;
    });
    const el = card({ template: 't' }, stubHass());
    document.body.appendChild(el);
    await until(() => !!inner(el), 2000, 'the wrapped card');
    await settle(6);
    expect(fired).to.equal(0);
  });
});
