import { HomeAssistant } from 'custom-card-helpers';
import { itemTemplatesOf } from './templates';
import { loadLabels } from './labels';
import { loadCategories, wantsCategories } from './categories';
import { renderTemplateOnce } from './template-source';
import {
  dashboardWantsLabels,
  generateDashboard,
  generateView,
  renderStrategyTemplates,
  wantsLabels,
} from './strategy';
import { getLovelaceConfig } from './utils';
import { sourceContext, warnUnlisted } from './shared';

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
