/*
 * "Try a template" (#427) builds a card the way the card does, from the same steps. These
 * build each case twice - in the real card element, and through the docs page's runTemplate
 * with the same templates and the same hass - and check the two hand over the same config.
 */
import { describe, it, expect, until } from './runner';
import { stubHass, stubLovelace } from './stubs';
import { runTemplate } from '../../src/try-template';
import { withoutStamps } from '../../src/cycles';

/* eslint-disable @typescript-eslint/no-explicit-any */

const CARD = 'custom:decluttering-card-plus';

const plain = (value: unknown): unknown => JSON.parse(JSON.stringify(value ?? null));

async function both(
  dashboard: Record<string, any>,
  config: Record<string, any>,
  states: Record<string, string> = {},
): Promise<{ el: any; page: any }> {
  stubLovelace({ views: [{ cards: [] }], ...dashboard });
  const hass = stubHass(states);
  const el = document.createElement('decluttering-card-plus') as any;
  el.setConfig({ type: CARD, ...config });
  el.hass = hass;
  document.body.appendChild(el);
  await until(() => !!el._thingConfig || !!el._error, 3000, 'a build');
  const page = runTemplate({ views: [{ cards: [] }], ...dashboard }, { type: CARD, ...config }, hass);
  return { el, page };
}

const built = (el: any): unknown => plain(withoutStamps(el._thingConfig));

describe('Try a template builds what the card builds (#427)', () => {
  it('a template with defaults, let, an override and grid_options', async () => {
    const { el, page } = await both(
      {
        decluttering_defaults: [{ accent: 'amber' }],
        decluttering_templates: {
          t: {
            default: [{ size: 2 }],
            let: [{ slug: '[[room|slug]]' }],
            variables: [{ name: 'colour', default: '[[accent]]' }],
            grid_options: { columns: 6 },
            card: {
              type: 'tile',
              entity: 'light.[[slug]]',
              color: '[[colour]]',
              name: '[[room]] ([[size|mul:2]])',
              icon: '[[icon?]]',
            },
          },
        },
      },
      { template: 't', variables: [{ room: 'Living Room' }], card: { vertical: true } },
    );
    expect(plain(page.builds[0].built)).to.deep.equal(built(el));
    expect(plain(page.final)).to.deep.equal(built(el));
  });

  it('an item template repeated inside the card, and a function step', async () => {
    const { el, page } = await both(
      {
        decluttering_templates: {
          row: { default: [{ icon: 'mdi:lightbulb' }], item: { entity: '[[entity]]', icon: '[[icon]]' } },
          shout: { function: '[[value|upper]]!' },
          t: { card: { type: 'entities', title: '[[title|shout]]', entities: '[[row|repeat:lights]]' } },
        },
      },
      {
        template: 't',
        variables: [{ title: 'lights' }, { lights: [{ entity: 'light.a' }, { entity: 'light.b', icon: 'mdi:lamp' }] }],
      },
    );
    expect(plain(page.final)).to.deep.equal(built(el));
  });

  it('a failed check, __alerts__ and the strict notice', async () => {
    const { el, page } = await both(
      {
        decluttering_templates: {
          t: {
            strict: { warnings: 'notice' },
            checks: [
              {
                name: 'No camera',
                condition: '[[camera|exists]]',
                fail_on: false,
                level: 'warn',
                message: 'No [[camera]].',
              },
            ],
            card: { type: 'markdown', content: '[[__alerts__.all.count]] [[__alerts__.all.highest_level]]' },
          },
        },
      },
      { template: 't', variables: [{ camera: 'camera.gone' }] },
    );
    expect(plain(page.final)).to.deep.equal(built(el));
    expect(page.builds[0].notice).to.deep.equal(el._strictNotice);
  });

  it("a template's alert: in place of the card", async () => {
    const { el, page } = await both(
      {
        decluttering_templates: {
          t: {
            checks: [{ condition: '[[camera|exists]]', fail_on: false, message: 'No [[camera]].' }],
            alert: { type: 'markdown', content: '[[__alerts__.warn.items.0.message]]' },
            card: { type: 'picture-entity', entity: '[[camera]]' },
          },
        },
      },
      { template: 't', variables: [{ camera: 'camera.gone' }] },
    );
    expect(plain(page.final)).to.deep.equal(built(el));
  });

  it('for_each in columns, with a copy its required variable leaves out', async () => {
    const { el, page } = await both(
      {
        decluttering_templates: {
          t: {
            variables: [{ name: 'entity', required: true }],
            card: { type: 'tile', entity: '[[entity]]', name: '[[index]] of [[count]]' },
          },
        },
      },
      { template: 't', columns: 2, for_each: [{ entity: 'light.a' }, { name: 'none' }, { entity: 'light.c' }] },
    );
    expect(plain(page.final)).to.deep.equal(built(el));
  });

  it('template_by_domain on a single card', async () => {
    const { el, page } = await both(
      {
        decluttering_templates: {
          light_t: { card: { type: 'tile', entity: '[[entity]]', icon: 'mdi:lightbulb' } },
          other_t: { card: { type: 'entity', entity: '[[entity]]' } },
        },
      },
      { template_by_domain: { light: 'light_t', default: 'other_t' }, variables: [{ entity: 'light.hall' }] },
    );
    expect(plain(page.final)).to.deep.equal(built(el));
  });

  it('extends, and the dashboard defaults under it', async () => {
    const { el, page } = await both(
      {
        decluttering_defaults: [{ shade: 'dark' }],
        decluttering_templates: {
          base: { default: [{ colour: 'red' }], card: { type: 'tile', color: '[[colour]]', name: '[[shade]]' } },
          child: { extends: 'base', default: [{ colour: 'blue' }] },
        },
      },
      { template: 'child' },
    );
    expect(plain(page.final)).to.deep.equal(built(el));
  });

  it('a card of ours as the card, handed variables, built in its place', async () => {
    const { el, page } = await both(
      {
        decluttering_templates: {
          inner: { default: [{ colour: 'amber' }], card: { type: 'tile', entity: '[[entity]]', color: '[[colour]]' } },
          outer: {
            let: [{ hall: 'light.hall' }],
            card: { type: CARD, template: 'inner', inherit_variables: true, variables: [{ entity: '[[hall]]' }] },
          },
        },
      },
      { template: 'outer', variables: [{ colour: 'blue' }] },
    );
    expect(plain(page.builds[0].built)).to.deep.equal(built(el));
    const nested = () => el.shadowRoot?.querySelector('hui-card')?.firstElementChild as any;
    await until(() => !!nested()?._thingConfig, 3000, 'the card inside');
    expect(plain(page.builds[1].built)).to.deep.equal(built(nested()));
    expect(plain(page.final)).to.deep.equal(built(nested()));
  });
});
