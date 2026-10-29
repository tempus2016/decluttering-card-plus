import { DeclutteringCardConfig, DeclutteringTemplateConfig, TemplateConfig } from './types';
import { collectTemplates, collectAllTemplates } from './templates';
import { entitySuggestions, moveToFront, publishedStub, publishedTemplates } from './picker';
import { loadLabels } from './labels';
import { loadCategories, wantsCategories } from './categories';
import { getLovelaceConfig } from './utils';
import { localize } from './localize';
import { DeclutteringCard } from './card';
import { DeclutteringLazyCopy } from './lazy-copy';
import { CARD_TAG, LAZY_COPY_TAG, TEMPLATE_TAG, defineElement } from './shared';
import { DeclutteringDashboardStrategy, DeclutteringViewStrategy } from './strategies';
import { DeclutteringTemplate } from './template-card';

// Home Assistant finds a custom view strategy by this tag, from `type: custom:decluttering-card-plus`.
const STRATEGY_TAG = 'll-strategy-view-decluttering-card-plus';

// And a dashboard strategy by this one, from the same type written on the dashboard itself.
const DASHBOARD_STRATEGY_TAG = 'll-strategy-dashboard-decluttering-card-plus';

// Tags of the original custom-cards/decluttering-card, claimed when it is not installed
// so that existing configurations keep working unchanged.
const LEGACY_CARD_TAG = 'decluttering-card';

const LEGACY_TEMPLATE_TAG = 'decluttering-template';

// The editors are not defined here: they arrive with their own chunk when an editor opens (see editors.ts).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customCards: any[] = ((window as any).customCards = (window as any).customCards || []);

// Home Assistant keeps a separate registry for badges, which is what its badge picker reads.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customBadges: any[] = ((window as any).customBadges = (window as any).customBadges || []);

// Shown as the documentation link on the entry in Home Assistant's card and badge pickers.
const DOCUMENTATION_URL = 'https://github.com/tempus2016/decluttering-card-plus';

/*
 * Home Assistant asks for suggestions synchronously, while the add-card dialog is open, so
 * templates on other dashboards have to be fetched before it asks. They are read when the
 * page loads and again on every question, for the next one; this dashboard's own
 * templates are read fresh each time, edits not yet saved included.
 */
let borrowedForSuggestions: Record<string, TemplateConfig> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function refreshSuggestionTemplates(hass: any): void {
  if (!hass) return;
  void collectAllTemplates(hass, getLovelaceConfig())
    .then((all) => {
      borrowedForSuggestions = all;
      publishTemplates();
      // Labels are not on hass, and only a template narrowing by one needs them fetched.
      if (Object.values(all).some((template) => (template.suggest_for as { label?: unknown })?.label)) {
        void loadLabels(hass);
      }
      if (wantsCategories(Object.values(all).map((template) => template.suggest_for))) void loadCategories(hass);
    })
    .catch(() => undefined);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function suggestionsFor(hass: any, entityId: string, kind: 'card' | 'badge'): unknown[] | null {
  refreshSuggestionTemplates(hass);
  const templates = { ...borrowedForSuggestions, ...collectTemplates(getLovelaceConfig()) };
  const found = entitySuggestions(hass, entityId, templates, kind, `custom:${CARD_TAG}`);
  return found.length ? found : null;
}

/*
 * Templates with `publish:` are listed in the add-card dialog as cards of their own. The
 * dialog only knows an entry by its element type, so each one gets an element whose stub
 * config is an ordinary decluttering card using that template - nothing on a dashboard
 * ever names the element itself, so a template unpublished or deleted later breaks nothing.
 */
const publishedEntries = new Set<unknown>();

const publishedAs = new Map<string, string>();

const publishedConfigs = new Map<string, TemplateConfig>();

function publishTemplates(): void {
  const templates = { ...borrowedForSuggestions, ...collectTemplates(getLovelaceConfig()) };
  for (const list of [customCards, customBadges]) {
    for (let i = list.length - 1; i >= 0; i--) if (publishedEntries.has(list[i])) list.splice(i, 1);
  }
  publishedEntries.clear();
  publishedConfigs.clear();
  for (const [name, template] of Object.entries(templates)) publishedConfigs.set(name, template);
  for (const published of publishedTemplates(templates)) {
    publishedAs.set(published.tag, published.template);
    if (!customElements.get(published.tag)) {
      const tag = published.tag;
      customElements.define(
        tag,
        class extends DeclutteringCard {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          static getStubConfig(hass?: any): DeclutteringCardConfig {
            const template = publishedAs.get(tag) ?? '';
            return publishedStub(hass, template, publishedConfigs.get(template), `custom:${CARD_TAG}`);
          }
        },
      );
    }
    const entry = {
      type: published.tag,
      documentationURL: DOCUMENTATION_URL,
      name: published.name,
      preview: true,
      description: published.description ?? localize('picker.published_description', { template: published.template }),
    };
    publishedEntries.add(entry);
    (published.kind === 'badge' ? customBadges : customCards).push(entry);
  }
}

// The dialog reads the list as it opens, so the list is brought up to date just before.
window.addEventListener(
  'show-dialog',
  (event) => {
    const tag = (event as CustomEvent).detail?.dialogTag;
    if (tag === 'hui-dialog-create-card' || tag === 'hui-dialog-create-badge') publishTemplates();
  },
  true,
);

// The page's hass is there a moment after the resources load, not before.
function preloadSuggestionTemplates(tries = 0): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hass = (document.querySelector('home-assistant') as any)?.hass;
  if (hass) refreshSuggestionTemplates(hass);
  else if (tries < 30) setTimeout(() => preloadSuggestionTemplates(tries + 1), 1000);
}

if (defineElement(CARD_TAG, DeclutteringCard)) {
  // First in the list, so the By entity tab offers the templates that match an entity
  // before the other custom cards' suggestions (idea 22).
  moveToFront(customCards, {
    type: CARD_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Card Plus',
    preview: false,
    description: localize('picker.card_description'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getEntitySuggestion: (hass: any, entityId: string) => suggestionsFor(hass, entityId, 'card'),
  });
  moveToFront(customBadges, {
    type: CARD_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Card Plus',
    preview: false,
    description: localize('picker.badge_description'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getEntitySuggestion: (hass: any, entityId: string) => suggestionsFor(hass, entityId, 'badge'),
  });
  preloadSuggestionTemplates();
}

defineElement(STRATEGY_TAG, DeclutteringViewStrategy);

defineElement(DASHBOARD_STRATEGY_TAG, DeclutteringDashboardStrategy);

defineElement(LAZY_COPY_TAG, DeclutteringLazyCopy);

if (defineElement(TEMPLATE_TAG, DeclutteringTemplate)) {
  customCards.push({
    type: TEMPLATE_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Template Plus',
    preview: false,
    description: localize('picker.template_description'),
  });
}

/*
 * Drop-in replacement for the original card: claim `decluttering-card` and
 * `decluttering-template` as well, so existing configurations keep working without
 * being edited. If the original card is also installed it registers those tags first
 * (or we do, depending on resource order) and whoever loses simply skips them.
 *
 * A single constructor cannot be registered under two tags, hence the subclasses.
 */
class LegacyDeclutteringCard extends DeclutteringCard {
  static getStubConfig(): DeclutteringCardConfig {
    return { ...DeclutteringCard.getStubConfig(), type: `custom:${LEGACY_CARD_TAG}` };
  }
}

class LegacyDeclutteringTemplate extends DeclutteringTemplate {
  static getStubConfig(): DeclutteringTemplateConfig {
    return { ...DeclutteringTemplate.getStubConfig(), type: `custom:${LEGACY_TEMPLATE_TAG}` };
  }
}

if (defineElement(LEGACY_CARD_TAG, LegacyDeclutteringCard)) {
  customCards.push({
    type: LEGACY_CARD_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Card (compatibility)',
    preview: false,
    description: localize('picker.legacy_card_description'),
  });
}

if (defineElement(LEGACY_TEMPLATE_TAG, LegacyDeclutteringTemplate)) {
  customCards.push({
    type: LEGACY_TEMPLATE_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Template (compatibility)',
    preview: false,
    description: localize('picker.legacy_template_description'),
  });
}
