import { HomeAssistant } from 'custom-card-helpers';
import { collectAllTemplates, itemTemplatesOf } from './templates';
import { labelRegistry, loadLabels } from './labels';
import { categoryRegistry, loadCategories, wantsCategories } from './categories';
import { renderTemplateOnce } from './template-source';
import {
  generateSection,
  generateView,
  renderStrategyTemplates,
  dashboardWantsLabels,
  sectionStubTemplate,
  STRATEGY_REGISTRIES,
  STRATEGY_TYPE,
  StrategyRead,
  strategyStale,
  wantsLabels,
  writeDashboard,
} from './strategy';
import { publishedStub } from './picker';
import { getLovelaceConfig } from './utils';
import { CARD_EDITOR_TAG, sourceContext, warnUnlisted } from './shared';

/*
 * What each strategy config read of the label and category registries when it last ran.
 * Those are fetched by this card rather than carried on hass, so Home Assistant's own
 * comparison of one hass with the next never sees them change; see strategyStale.
 */
const reads = new WeakMap<object, StrategyRead>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function remember(config: any, hass: any, labels: boolean, categories: boolean): void {
  if (!config || typeof config !== 'object' || (!labels && !categories)) return;
  reads.set(config, {
    ...(labels ? { labels: labelRegistry(hass) } : {}),
    ...(categories ? { categories: categoryRegistry() } : {}),
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function stale(config: any, oldHass: any, newHass: any): boolean {
  const read = config && typeof config === 'object' ? reads.get(config) : undefined;
  const now = { labels: labelRegistry(newHass), categories: categoryRegistry() };
  if (!strategyStale(read, oldHass, newHass, now)) return false;
  // Said once: Home Assistant asks on every hass update, and the strategy it runs in answer
  // takes a moment to fetch what changed and note it.
  if (read)
    reads.set(config, {
      ...('labels' in read ? { labels: now.labels } : {}),
      ...('categories' in read ? { categories: now.categories } : {}),
    });
  return true;
}

/*
 * The view strategy - `strategy: { type: custom:decluttering-card-plus }` on a view - which
 * writes out a section or a badge per item. Home Assistant asks the element for the view
 * through a static `generate`, and never creates one; see strategy.ts.
 */
export class DeclutteringViewStrategy extends HTMLElement {
  // What Home Assistant compares between one hass and the next to decide whether the view
  // needs writing out again. Floors are not in its own default list, and a repeat can
  // depend on them as much as on areas.
  static registryDependencies = STRATEGY_REGISTRIES;

  // The same registries, and the labels and categories a repeat read that hass does not carry.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static shouldRegenerate(config: any, oldHass: any, newHass: any): boolean {
    return stale(config, oldHass, newHass);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async generate(config: any, hass: HomeAssistant): Promise<unknown> {
    const labels = wantsLabels(config);
    const categories = wantsCategories([config?.sections, config?.badges]);
    if (labels) await loadLabels(hass);
    if (categories) await loadCategories(hass);
    remember(config, hass, labels, categories);
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
  static registryDependencies = STRATEGY_REGISTRIES;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static shouldRegenerate(config: any, oldHass: any, newHass: any): boolean {
    return stale(config, oldHass, newHass);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async generate(config: any, hass: HomeAssistant): Promise<unknown> {
    const written = await DeclutteringDashboardStrategy.write(config, hass);
    remember(config, hass, dashboardWantsLabels(config), wantsCategories(config?.views));
    return written;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static write(config: any, hass: HomeAssistant): Promise<unknown> {
    // A page (idea 33) may name a template this strategy borrows, which only hass can fetch.
    return writeDashboard(config, hass, {
      render: (template) => renderTemplateOnce(hass, template),
      labels: () => loadLabels(hass),
      categories: () => loadCategories(hass),
      templates: () => collectAllTemplates(hass, config),
      onRendered: (template, render) => warnUnlisted(template, render, hass),
    });
  }
}

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
    return stale(config, oldHass, newHass);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async generate(config: any, hass: HomeAssistant): Promise<unknown> {
    if (config?.section === undefined) return generateSection(config, hass);
    const labels = wantsLabels({ sections: [config.section] });
    const categories = wantsCategories([config.section]);
    if (labels) await loadLabels(hass);
    if (categories) await loadCategories(hass);
    remember(config, hass, labels, categories);
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
