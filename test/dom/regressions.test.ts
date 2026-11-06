/*
 * The regressions that came back, each one line against a rendered element (idea 6):
 * v1.8.0 a hidden card kept its slot; v1.8.0 a badge stayed hidden in edit mode because
 * hui-badge never forwards preview; v1.10.0 masonry looped on card-updated per connect;
 * v1.10.0 section defaults did not reach the card; v1.15.0 a group whose cards all hide
 * did not hide itself.
 */
import { describe, it, expect, settle, until } from './runner';
import { stubHass, stubLovelace, stubPathSection, stubSection } from './stubs';

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

describe('section placed by path (Home Assistant 2026.11, #387)', () => {
  it('section defaults still reach the card', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: '[[name]]' } } },
      views: [
        { type: 'sections', sections: [] },
        {
          type: 'sections',
          sections: [{ cards: [] }, { decluttering_defaults: [{ name: 'From the section' }], cards: [] }],
        },
      ],
    });
    const section = stubPathSection(['views', 1, 'sections', 1]);
    const el = card({ template: 't' }, stubHass());
    section.appendChild(el);
    await until(() => inner(el)?.config?.content === 'From the section', 2000, 'the section default');
    expect(inner(el).config.content).to.equal('From the section');
  });

  it('a section inside a section takes the values of the one in the view', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: '[[name]]' } } },
      views: [
        { type: 'sections', sections: [{ decluttering_defaults: [{ name: 'From the outer section' }], cards: [] }] },
      ],
    });
    const section = stubPathSection(['views', 0, 'sections', 0, 'sections', 2]);
    const el = card({ template: 't' }, stubHass());
    section.appendChild(el);
    await until(() => inner(el)?.config?.content === 'From the outer section', 2000, 'the outer section default');
    expect(inner(el).config.content).to.equal('From the outer section');
  });

  it('the card still says once that its size is known', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: 'x' } } },
      views: [{ type: 'sections', sections: [{ cards: [] }] }],
    });
    const section = stubPathSection(['views', 0, 'sections', 0]);
    let fired = 0;
    section.addEventListener('card-updated', () => {
      fired += 1;
    });
    const el = card({ template: 't' }, stubHass());
    section.appendChild(el);
    await until(() => !!inner(el), 2000, 'the wrapped card');
    await settle(6);
    expect(fired).to.equal(1);
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

describe('checks (#389)', () => {
  const template = (extra: Record<string, any> = {}): Record<string, any> => ({
    default: [{ camera: 'camera.front' }],
    checks: [
      {
        name: 'No camera',
        condition: '[[camera|exists]]',
        fail_on: false,
        level: 'error',
        message: 'The camera [[camera]] is not there.',
        ...extra,
      },
      { condition: '[[camera|contains:dummy]]', message: '[[camera]] is a dummy.' },
    ],
    card: { type: 'markdown', content: '[[__alerts__.all.count]] [[__alerts__.all.highest_level]]' },
  });
  const report = (el: any): any => el.shadowRoot?.querySelector('ha-card.report');

  it('a card whose checks pass builds as ever, with nothing in __alerts__', async () => {
    stubLovelace({ decluttering_templates: { t: template() }, views: [{ cards: [] }] });
    const el = card({ template: 't' }, stubHass({ 'camera.front': 'idle' }));
    document.body.appendChild(el);
    await until(() => !!inner(el)?.config, 2000, 'a build');
    expect(inner(el).config.content).to.equal('0 ');
    expect(report(el)).to.equal(null);
  });

  it('a failed warning builds the card and says so in __alerts__, without the report', async () => {
    stubLovelace({ decluttering_templates: { t: template() }, views: [{ cards: [] }] });
    const el = card({ template: 't', variables: [{ camera: 'camera.dummy' }] }, stubHass({ 'camera.dummy': 'idle' }));
    document.body.appendChild(el);
    await until(() => !!inner(el)?.config, 2000, 'a build');
    expect(inner(el).config.content).to.equal('1 warn');
    expect(report(el)).to.equal(null);
  });

  it('a failed error shows the report under the card with debug off, the check at its top', async () => {
    stubLovelace({ decluttering_templates: { t: template() }, views: [{ cards: [] }] });
    const el = card({ template: 't', variables: [{ camera: 'camera.gone' }] }, stubHass());
    document.body.appendChild(el);
    await until(() => !!report(el) && !!el._reportText, 3000, 'the report');
    expect(inner(el).config.content).to.equal('1 error');
    expect(el._reportText).to.include('## Failed checks');
    expect(el._reportText).to.include('The camera camera.gone is not there.');
  });

  it('the report goes again once the error has', async () => {
    stubLovelace({ decluttering_templates: { t: template() }, views: [{ cards: [] }] });
    const el = card({ template: 't', variables: [{ camera: 'camera.gone' }] }, stubHass());
    document.body.appendChild(el);
    await until(() => !!report(el), 3000, 'the report');
    el.setConfig({ template: 't' });
    el.hass = stubHass({ 'camera.front': 'idle' });
    await until(() => inner(el)?.config?.content === '0 ', 2000, 'a clean build');
    await settle();
    expect(report(el)).to.equal(null);
  });

  it('an error that does not continue fails the card, and on_error shows the alerts', async () => {
    stubLovelace({
      decluttering_templates: {
        t: {
          ...template({ continue_rendering: false }),
          on_error: { type: 'markdown', content: 'Fix: [[__alerts__.error.items|join]]' },
        },
      },
      views: [{ cards: [] }],
    });
    const el = card({ template: 't', variables: [{ camera: 'camera.gone' }] }, stubHass());
    document.body.appendChild(el);
    await until(() => !!inner(el)?.config, 2000, 'the on_error card');
    expect(inner(el).config.content).to.equal('Fix: The camera camera.gone is not there.');
  });

  it('without on_error it shows the error card, with the check message in it', async () => {
    stubLovelace({ decluttering_templates: { t: template({ continue_rendering: false }) }, views: [{ cards: [] }] });
    const el = card({ template: 't', variables: [{ camera: 'camera.gone' }] }, stubHass());
    document.body.appendChild(el);
    await settle(4);
    const alert = el.shadowRoot?.querySelector('ha-alert[alert-type="error"]');
    expect(alert?.textContent ?? '').to.include('The camera camera.gone is not there.');
  });

  it("a template's alert: shows instead of the card while a check fails, and instead of the report", async () => {
    stubLovelace({
      decluttering_templates: {
        t: { ...template(), alert: { type: 'markdown', content: 'Alert: [[__alerts__.error.items|join]]' } },
      },
      views: [{ cards: [] }],
    });
    const el = card({ template: 't', variables: [{ camera: 'camera.gone' }] }, stubHass());
    document.body.appendChild(el);
    await until(() => !!inner(el)?.config, 2000, 'the alert');
    await settle();
    expect(inner(el).config.content).to.equal('Alert: The camera camera.gone is not there.');
    expect(report(el)).to.equal(null);
  });

  it('the card editor shows a failed warning or error, never an info', async () => {
    const lovelace = stubLovelace({
      decluttering_templates: {
        t: { ...template(), checks: [...template().checks, { condition: true, level: 'info', message: 'Just so.' }] },
      },
      views: [{ cards: [] }],
    });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    editor.hass = stubHass({ 'camera.dummy': 'idle' });
    editor.lovelace = lovelace.config;
    editor.setConfig({ type: 'custom:decluttering-card-plus', template: 't', variables: [{ camera: 'camera.dummy' }] });
    document.body.appendChild(editor);
    await settle(6);
    const alerts = [...(editor.shadowRoot?.querySelectorAll('ha-alert') ?? [])].map((each: any) =>
      each.textContent.trim(),
    );
    expect(alerts).to.include('Check failed: camera.dummy is a dummy.');
    expect(alerts.some((text: string) => text.includes('Just so.'))).to.equal(false);
  });

  it('a repeat checks every copy with its own values', async () => {
    stubLovelace({ decluttering_templates: { t: template() }, views: [{ cards: [] }] });
    const el = card(
      { template: 't', for_each: [{ camera: 'camera.front' }, { camera: 'camera.dummy' }] },
      stubHass({ 'camera.front': 'idle', 'camera.dummy': 'idle' }),
    );
    document.body.appendChild(el);
    await until(() => !!inner(el)?.config?.cards, 2000, 'the copies');
    expect(inner(el).config.cards.map((copy: any) => copy.content)).to.deep.equal(['0 ', '1 warn']);
  });
});

describe('strict level by level (#390)', () => {
  const shadow = (el: any, selector: string): any => el.shadowRoot?.querySelector(selector);
  // A mapping run through |lower is refused - a warning - and [[nobody]] has no value - an error.
  const refusing = { t: { card: { type: 'markdown', content: '[[tap|lower]]' } } };
  const unset = { t: { card: { type: 'markdown', content: '[[nobody]]' } } };
  const tap = [{ tap: { action: 'toggle' } }];

  it('strict: true still refuses a card with a variable left unset', async () => {
    stubLovelace({ decluttering_templates: unset, views: [{ cards: [] }] });
    const el = card({ template: 't', strict: true }, stubHass());
    document.body.appendChild(el);
    await until(() => !!shadow(el, 'ha-alert[alert-type="error"]'), 2000, 'the strict refusal');
    expect(inner(el), 'nothing built in its place').to.equal(null);
  });

  it('strict: true leaves a card that only warns as it always did', async () => {
    stubLovelace({ decluttering_templates: refusing, views: [{ cards: [] }] });
    const el = card({ template: 't', variables: tap, strict: true }, stubHass());
    document.body.appendChild(el);
    await until(() => !!inner(el), 2000, 'the wrapped card');
    await settle();
    expect(shadow(el, '.strict-notice'), 'no notice').to.equal(null);
    expect(shadow(el, 'ha-card.report'), 'no report').to.equal(null);
  });

  it('warnings: notice shows a notice on the card that can be closed', async () => {
    stubLovelace({ decluttering_templates: refusing, views: [{ cards: [] }] });
    const el = card({ template: 't', variables: tap, strict: { warnings: 'notice' } }, stubHass());
    document.body.appendChild(el);
    await until(() => !!shadow(el, '.strict-notice'), 2000, 'the notice');
    expect(!!inner(el), 'the card renders under it').to.equal(true);
    expect(shadow(el, '.strict-notice').textContent).to.match(/transform/);
    shadow(el, '.strict-notice').dispatchEvent(new CustomEvent('alert-dismissed-clicked'));
    await settle();
    expect(shadow(el, '.strict-notice'), 'closed').to.equal(null);
  });

  it('errors: report renders the card with the debug report under it', async () => {
    stubLovelace({ decluttering_templates: unset, views: [{ cards: [] }] });
    const el = card({ template: 't', strict: { errors: 'report' } }, stubHass());
    document.body.appendChild(el);
    await until(() => !!shadow(el, 'ha-card.report'), 2000, 'the report');
    expect(!!inner(el), 'the card renders too').to.equal(true);
  });

  it('errors: report shows no report when nothing is wrong', async () => {
    stubLovelace({ decluttering_templates: unset, views: [{ cards: [] }] });
    const el = card({ template: 't', variables: [{ nobody: 'x' }], strict: { errors: 'report' } }, stubHass());
    document.body.appendChild(el);
    await until(() => !!inner(el), 2000, 'the wrapped card');
    await settle();
    expect(shadow(el, 'ha-card.report')).to.equal(null);
  });

  it('decluttering_strict on the dashboard reaches the card, and the card can turn it off', async () => {
    stubLovelace({ decluttering_templates: unset, decluttering_strict: { errors: 'fail' }, views: [{ cards: [] }] });
    const refused = card({ template: 't' }, stubHass());
    document.body.appendChild(refused);
    await until(() => !!shadow(refused, 'ha-alert[alert-type="error"]'), 2000, 'the dashboard-wide refusal');
    const own = card({ template: 't', strict: false }, stubHass());
    document.body.appendChild(own);
    await until(() => !!inner(own), 2000, 'the card that turned it off');
  });

  it('a template strict: applies to the cards using it', async () => {
    stubLovelace({
      decluttering_templates: { t: { strict: { warnings: 'notice' }, card: refusing.t.card } },
      views: [{ cards: [] }],
    });
    const el = card({ template: 't', variables: tap }, stubHass());
    document.body.appendChild(el);
    await until(() => !!shadow(el, '.strict-notice'), 2000, 'the notice');
  });

  it('a section decluttering_strict reaches a card in it', async () => {
    stubLovelace({
      decluttering_templates: unset,
      views: [{ type: 'sections', sections: [{ decluttering_strict: { errors: 'fail' }, cards: [] }] }],
    });
    const section = stubSection(0, 0);
    const el = card({ template: 't' }, stubHass());
    section.appendChild(el);
    await until(() => !!shadow(el, 'ha-alert[alert-type="error"]'), 2000, 'the section refusal');
  });
});
