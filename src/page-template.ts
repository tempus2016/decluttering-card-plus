import { TemplateConfig, VariablesConfig } from './types';
import deepReplace from './deep-replace';
import { normaliseVariables } from './variables';
import { localize } from './localize';
import { declutteringKeys, splitDeclutteringKeys, withoutRepeatContent } from './page-body';

export { declutteringKeys, splitDeclutteringKeys, withoutRepeatContent };

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * A template for a whole dashboard (idea 33): a fifth kind, `dashboard:`, beside card,
 * badge, row and element, and a dashboard that is nothing but a page pointing at it.
 *
 *   strategy:
 *     type: custom:decluttering-card-plus
 *     decluttering_templates:
 *       kiosk_page:
 *         dashboard:
 *           wallpanel: { enabled: '[[use_wallpanel|bool]]', hide_toolbar: true }
 *           views:
 *             - title: '[[room|title]]'
 *               cards: [...]
 *     page:
 *       template: kiosk_page
 *       variables:
 *         - use_wallpanel: true
 *         - room: kitchen
 *
 * Home Assistant only ever hands a whole dashboard to this card through its strategy, so
 * that is where the page lives. Whatever the template builds becomes the dashboard, and
 * then goes through the same writing-out a dashboard strategy always does - so a repeated
 * view inside the page works as it would anywhere. A strategy with views of its own
 * alongside a page is refused with a dashboard that says so, rather than merged.
 */
export const PAGE_KEY = 'page';
export const DASHBOARD_KIND = 'dashboard';

export interface PageRequest {
  template: string;
  variables?: VariablesConfig[] | Record<string, unknown>;
}

/** The page a strategy asks for, when it asks for one. */
export function pageOf(config: unknown): PageRequest | undefined {
  const page = (config as any)?.[PAGE_KEY] ?? (config as any)?.decluttering_page;
  if (!page || typeof page !== 'object' || typeof page.template !== 'string' || !page.template) return undefined;
  return { template: page.template, variables: page.variables };
}

/** Whether a template is a page template - one with a `dashboard:` body. */
export function isPageTemplate(template: TemplateConfig | undefined): boolean {
  return !!template && typeof template === 'object' && DASHBOARD_KIND in template;
}

export type PageBuild = { dashboard: Record<string, unknown> } | { error: string };

/** A dashboard with one view that says what went wrong, for a page that could not be built. */
export function errorDashboard(message: string): Record<string, unknown> {
  return { views: [{ title: 'Page', cards: [{ type: 'markdown', content: message }] }] };
}

/**
 * The dashboard a page template builds for a strategy's `page:`: the template's `dashboard:`
 * body with the page's variables filled in, the strategy's decluttering keys kept so the
 * cards in it find their templates, and the page key gone so nothing builds it again.
 */
export function buildPage(
  config: Record<string, unknown>,
  templates: Record<string, TemplateConfig>,
  hass?: any,
): PageBuild {
  const page = pageOf(config);
  if (!page) return { error: '' };
  if (Array.isArray(config.views) && config.views.length) {
    return { error: localize('error.page_with_views', { template: page.template }, hass) };
  }
  const template = Object.prototype.hasOwnProperty.call(templates, page.template)
    ? templates[page.template]
    : undefined;
  if (!template) return { error: localize('error.page_template_missing', { template: page.template }, hass) };
  if (!isPageTemplate(template)) {
    return { error: localize('error.page_template_kind', { template: page.template }, hass) };
  }
  const body = (template as any)[DASHBOARD_KIND];
  const variables = normaliseVariables(page.variables);
  // The template keys inside the body are definitions, filled in by each card that uses them.
  const { held, rest } = splitDeclutteringKeys(body);
  // Quietly: a repeat's `[[entity]]`, `[[index]]`... are filled by the writing-out after
  // this, which warns about what is still unset then. What the page itself leaves unset is
  // still said, from the body with every repeat's content taken out.
  const built = deepReplace(variables, template, rest, page.template, hass, true);
  deepReplace(variables, template, withoutRepeatContent(rest), page.template, hass, false);
  const dashboard: Record<string, unknown> =
    built && typeof built === 'object' && !Array.isArray(built)
      ? { ...(built as Record<string, unknown>), ...held }
      : {};
  // The template's own decluttering keys come first; the strategy's win, as the nearer.
  Object.assign(dashboard, declutteringKeys(config));
  // The key that asked for the page is not part of the page: kept, it reads as a page again.
  delete dashboard.decluttering_page;
  return { dashboard };
}
