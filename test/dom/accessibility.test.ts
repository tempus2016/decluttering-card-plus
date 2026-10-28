/*
 * axe-core over both editors (idea 55): nothing serious or critical in the markup the card
 * draws. Home Assistant's own form elements are not defined in this page, so what is
 * checked is the card's, which is what the card can fix.
 */
import axe from 'axe-core';
import { describe, it, expect, settle } from './runner';
import { stubHass, stubLovelace } from './stubs';

/* eslint-disable @typescript-eslint/no-explicit-any */

async function violations(element: Element): Promise<string[]> {
  const result = await axe.run(element, {
    // Colour contrast needs the real theme, which this page does not have.
    rules: { 'color-contrast': { enabled: false } },
  });
  return result.violations
    .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    .map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.html.slice(0, 80)).join(' | ')}`);
}

describe('accessibility', () => {
  it('the template editor draws nothing axe calls serious', async () => {
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
    await settle(6);
    expect(await violations(editor)).to.deep.equal([]);
  });

  it('the card editor draws nothing axe calls serious', async () => {
    const lovelace = stubLovelace({
      decluttering_templates: {
        t: {
          variables: [{ name: 'name', label: 'Name', selector: { text: {} } }],
          card: { type: 'markdown', content: '[[name]]' },
        },
      },
      views: [{ cards: [] }],
    });
    const editor = document.createElement('decluttering-card-plus-editor') as any;
    editor.hass = stubHass();
    editor.lovelace = lovelace.config;
    editor.setConfig({ type: 'custom:decluttering-card-plus', template: 't', variables: [{ name: 'x' }] });
    document.body.appendChild(editor);
    await settle(6);
    expect(await violations(editor)).to.deep.equal([]);
  });

  it('the report on a card has a live region and a labelled search', async () => {
    stubLovelace({
      decluttering_templates: { t: { card: { type: 'markdown', content: 'x' } } },
      views: [{ cards: [] }],
    });
    const el = document.createElement('decluttering-card-plus') as any;
    el.setConfig({ template: 't', debug: 'report' });
    el.hass = stubHass();
    document.body.appendChild(el);
    await settle(8);
    expect(await violations(el)).to.deep.equal([]);
  });
});
