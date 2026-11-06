import { HomeAssistant } from 'custom-card-helpers';
import { collectAllTemplates, itemTemplatesOf } from './templates';
import { loadLabels } from './labels';
import { loadCategories, wantsCategories } from './categories';
import { renderTemplateOnce } from './template-source';
import {
  dashboardWantsLabels,
  generateDashboard,
  generateSection,
  generateView,
  renderStrategyTemplates,
  sectionStubTemplate,
  STRATEGY_TYPE,
  wantsLabels,
} from './strategy';
import { publishedStub } from './picker';
import { getLovelaceConfig } from './utils';
import { CARD_EDITOR_TAG, sourceContext, warnUnlisted } from './shared';

/*
 * The view strategy - `strategy: { type: custom:decluttering-card-plus }` on a view - which
 * writes out a section or a badge per item. Home Assistant asks the element for the view
 * through a static `generate`, and never creates one; see strategy.ts.
 */
export class DeclutteringViewStrategy extends HTMLElement {
  // What Home Assistant compares between one hass and the next to decide whether the view
  // needs writing out again. Floors are not in its own default list, and a repeat can
  // depend on them as much as on areas.
  static registryDependencies = ['entities', 'devices', 'areas', 'floors'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async generate(config: any, hass: HomeAssistant): Promise<unknown> {
    if (wantsLabels(config)) await loadLabels(hass);
    if (wantsCategories([config?.sections, config?.badges])) await loadCategories(hass);
    // Rendered once each, here, before the view is written - generate is the one place a
    // strategy may wait, and Home Assistant only calls it again on a registry change.
    const rendered = await renderStrategyTemplates(config, (template) => renderTemplateOnce(hass, template));
    for (const [template, render] of Object.entries(rendered)) warnUnlisted(template, render, hass);
    const ll = getLovelaceConfig();
    return generateView(config, hass, { ...sourceContext(ll), rendered, itemTemplates: itemTemplatesOf(ll) });
  }
}

/*
 * The dashboard strategy - the same `type: custom:decluttering-card-plus`, written as the
 * dashboard's own strategy - which writes out a view per item. Home Assistant tells the two
 * apart by where the strategy is written, and looks each up under a tag of its own.
 * Custom dashboard strategies are older than anything else this card needs (Home Assistant
 * 2021.5), so there is no newer floor for this one. See strategy.ts.
 */
export class DeclutteringDashboardStrategy extends HTMLElement {
  static registryDependencies = ['entities', 'devices', 'areas', 'floors'];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async generate(config: any, hass: HomeAssistant): Promise<unknown> {
    if (dashboardWantsLabels(config)) await loadLabels(hass);
    if (wantsCategories(config?.views)) await loadCategories(hass);
    // A view repeat reads the same sources a section repeat does, so its Jinja lists are
    // rendered the same way - once each, here, where a strategy may wait.
    const rendered = await renderStrategyTemplates({ sections: config?.views }, (template) =>
      renderTemplateOnce(hass, template),
    );
    for (const [template, render] of Object.entries(rendered)) warnUnlisted(template, render, hass);
    return generateDashboard(config, hass, { rendered });
  }
}

// What a written-out section strategy reads from hass, and so what makes it worth writing again.
const SECTION_DEPENDENCIES = ['entities', 'devices', 'areas', 'floors'];

/*
 * The section strategy (#400) - the same type again, written as one section's strategy -
 * which Home Assistant 2026.11 lists under "Community sections" in the add-section dialog
 * (see register.ts). It writes out one section: a card built from a template, or a section
 * written out with its placeholders filled. See generateSection in strategy.ts.
 */
export class DeclutteringSectionStrategy extends HTMLElement {
  /*
   * A section that only holds a templated card has nothing to write again: the card keeps
   * itself up to date. A section written out may name areas and devices in its placeholders,
   * so that one is written again when they change, the way the view strategy is.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static shouldRegenerate(config: any, oldHass: any, newHass: any): boolean {
    if (config?.section === undefined) return false;
    return SECTION_DEPENDENCIES.some((key) => oldHass?.[key] !== newHass?.[key]);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async generate(config: any, hass: HomeAssistant): Promise<unknown> {
    if (config?.section === undefined) return generateSection(config, hass);
    if (wantsLabels({ sections: [config.section] })) await loadLabels(hass);
    if (wantsCategories([config.section])) await loadCategories(hass);
    const ll = getLovelaceConfig();
    return generateSection(config, hass, { ...sourceContext(ll), itemTemplates: itemTemplatesOf(ll) });
  }

  /*
   * What the add-section dialog draws its preview tile with, and what a new section starts
   * from: a template on this dashboard or a borrowed one, given an entity its suggest_for
   * matches. With no template anywhere there is nothing worth previewing, and Home
   * Assistant shows the tile without one.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async getStubConfig(hass: HomeAssistant): Promise<any> {
    const templates = await collectAllTemplates(hass, getLovelaceConfig()).catch(() => ({}));
    const name = sectionStubTemplate(templates);
    if (name === undefined) return undefined;
    return publishedStub(hass, name, (templates as Record<string, never>)[name], STRATEGY_TYPE);
  }

  // The card's own editor: the options are the card's, so the editor is too.
  static async getConfigElement(): Promise<HTMLElement> {
    await import('./editors');
    return document.createElement(CARD_EDITOR_TAG);
  }
}
