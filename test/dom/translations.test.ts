/*
 * A template's own texts (#392) on a rendered card: `[[$key]]` in the language Home
 * Assistant is set to, and built again when that language changes.
 */
import { describe, it, expect, until } from './runner';
import { stubHass, stubLovelace } from './stubs';

/* eslint-disable @typescript-eslint/no-explicit-any */

const inner = (element: any): any => element.shadowRoot?.querySelector('hui-card');

function inLanguage(language: string): any {
  const hass = stubHass();
  return { ...hass, language, locale: { language } };
}

describe('template translations', () => {
  it('shows the text in the viewer language and follows a change of it', async () => {
    stubLovelace({
      decluttering_templates: {
        t: {
          language: {
            en: { title: 'Fubar', hello: 'Hello [[who]]' },
            gd: { title: 'Knackered', hello: 'Halò [[who]]' },
          },
          card: { type: 'markdown', title: '[[$title|upper]]', content: '[[$hello]]' },
        },
      },
      views: [{ cards: [] }],
    });
    const el = document.createElement('decluttering-card-plus') as any;
    el.setConfig({ template: 't', variables: [{ who: 'John' }] });
    el.hass = inLanguage('en');
    document.body.appendChild(el);
    await until(() => inner(el)?.config?.content === 'Hello John', 2000, 'the English text');
    expect(inner(el).config.title).to.equal('FUBAR');
    el.hass = inLanguage('gd');
    await until(() => inner(el)?.config?.content === 'Halò John', 2000, 'the Gaelic text');
    expect(inner(el).config.title).to.equal('KNACKERED');
    el.remove();
  });

  it('draws the template card preview in the viewer language once hass arrives', async () => {
    stubLovelace({ views: [{ cards: [] }] });
    const definer = document.createElement('decluttering-template-plus') as any;
    definer.setConfig({
      template: 't',
      language: { en: { hello: 'Hello' }, de: { hello: 'Hallo' } },
      card: { type: 'markdown', content: '[[$hello]]' },
    });
    definer.hass = inLanguage('de');
    definer.preview = true;
    document.body.appendChild(definer);
    await until(() => inner(definer)?.config?.content === 'Hallo', 2000, 'the German preview');
    definer.hass = inLanguage('en');
    await until(() => inner(definer)?.config?.content === 'Hello', 2000, 'the English preview');
    definer.remove();
  });
});
