import { LitElement, html, TemplateResult, css, CSSResult, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import { keyed } from 'lit/directives/keyed.js';
import {
  HomeAssistant,
  createThing,
  fireEvent,
  LovelaceCard,
  LovelaceCardEditor,
  LovelaceConfig,
} from 'custom-card-helpers';
import {
  DeclutteringCardConfig,
  DeclutteringTemplateConfig,
  TemplateConfig,
  VariablesConfig,
  LovelaceThing,
  LovelaceThingConfig,
  LovelaceThingType,
} from './types';
import deepReplace, { cssSafe } from './deep-replace';
import { buildExport, validateImport, freeName, missingCustomCards, withoutSources } from './share';
import { suggestVariables } from './suggest';
import { LIBRARY, libraryEntry, libraryNeeds, librarySource } from './library';
import {
  COMMUNITY_POST_URL,
  COMMUNITY_REPO,
  CommunityEntry,
  CommunityError,
  CommunityList,
  CommunityRisks,
  communityNeeds,
  communityRisks,
  communitySource,
  fetchCommunity,
  postBody,
  SharedUpdate,
  sharedUpdates,
  stampedTemplate,
} from './community';
import {
  collectTemplates,
  collectAllTemplates,
  addCardToView,
  collectUsages,
  countLegacyTypes,
  didYouMean,
  moderniseTypes,
  TEMPLATE_TYPE,
  findTemplate,
  findTemplateAnywhere,
  findTemplateLocation,
  getTemplateSources,
  mayBorrowTemplates,
  hasSectionDefaults,
  renameTemplate,
  TemplateUsages,
  viewIndexFromPath,
  templatePickerOptions,
  addTemplateToRoot,
  firstUsage,
  fetchDashboardPaths,
  usagesOnOtherDashboards,
  checkDashboard,
  listPlainCards,
  replaceCard,
  applyOverride,
  misplacedOverrides,
  groupCard,
  GROUP_CARD_TYPE,
  BY_DOMAIN_KEY,
  byDomainOf,
  pickTemplate,
  withPickedEntity,
  parentsOf,
  extendsLoops,
  deprecatedInUse,
  deprecationOf,
  warnIfDeprecated,
  installedFromShared,
  replaceTemplate,
} from './templates';

/*
 * Which view this card is being rendered in, read off the URL: the card only renders
 * while its view is showing. Outside a dashboard URL - an editor preview, say - there is
 * no view to speak of, and view-level defaults simply do not apply.
 */
function currentViewIndex(ll: Parameters<typeof viewIndexFromPath>[0]): number | undefined {
  if (typeof window === 'undefined') return undefined;
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments.length < 1) return undefined;
  return viewIndexFromPath(ll, segments[1]);
}

/** What a repeat source needs from the page beyond hass: the dashboard's views, for `views:`. */
function sourceContext(ll: LovelaceConfig | null | undefined): SourceContext {
  return { views: (ll as { views?: unknown[] } | null | undefined)?.views, dashboard: getDashboardPath() };
}

/*
 * Says in the console why a `for_each_from: { template: }` repeats nothing - it failed, or
 * it rendered something that is not a list. Named by the start of the Jinja itself, which
 * is the one thing that tells a card's and a view strategy's apart.
 */
function warnUnlisted(template: string, render: TemplateRender, hass?: HomeAssistant): void {
  const listed = templateList(render);
  if ('list' in listed) return;
  const source = template.length > 60 ? `${template.slice(0, 57)}...` : template;
  const key = listed.problem === 'error' ? 'warn.repeat_template_failed' : 'warn.repeat_template_not_list';
  console.warn(localize(key, { source, detail: listed.detail }, hass));
}

/** Where a card sits in a sections view: the view, and the section's place in it. */
type SectionPlace = { view: number; section: number };

/** The element's parent, stepping out of a shadow root to its host. */
function parentOf(node: Node): Node | null {
  return node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentNode;
}

/*
 * Where the card being edited sits, read off the edit dialog. Home Assistant 2026.7 hands
 * the dialog the dashboard, the card's config and - in a sections view - the section's
 * config, but no indices, so the section is found by being the same object in that
 * dashboard; the card, in a masonry view, the same way. Undefined when it cannot be told.
 */
function dialogPlace(dialog: Element): { view?: number; section?: number } | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params = (dialog as any)?._params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const views: any[] = params?.lovelaceConfig?.views ?? [];
  // Older Home Assistants handed the place itself: [view, card] or [view, section, card].
  const path = params?.path;
  if (Array.isArray(path) && Number.isInteger(path[0])) {
    return path.length > 2 && Number.isInteger(path[1]) ? { view: path[0], section: path[1] } : { view: path[0] };
  }
  for (let view = 0; view < views.length; view += 1) {
    if (params?.sectionConfig) {
      const section = (views[view]?.sections ?? []).indexOf(params.sectionConfig);
      if (section !== -1) return { view, section };
    } else if (params?.cardConfig && (views[view]?.cards ?? []).includes(params.cardConfig)) {
      return { view };
    }
  }
  return undefined;
}

/** The edit dialog an element is drawn in, if it is in one. */
function editDialogOf(element: Element): Element | undefined {
  for (let node: Node | null = element; node; node = parentOf(node)) {
    if ((node as Element).localName === 'hui-dialog-edit-card') return node as Element;
  }
  return undefined;
}

/*
 * Which section a card sits in, read off the hui-section it is rendered inside - through
 * any stacks, grids and shadow roots in between. Nothing hands a card this, and it can
 * only be read once the card is on the page. A card anywhere else - a masonry view, a
 * badge - is in no section. The edit dialog's preview draws the card inside a section of
 * its own that knows no place, so there it is the section the card being edited is in.
 */
function sectionOf(element: Element): SectionPlace | undefined {
  for (let node: Node | null = element; node; node = parentOf(node)) {
    if ((node as Element).localName === 'hui-section') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { index, viewIndex } = node as any;
      if (Number.isInteger(index) && Number.isInteger(viewIndex)) return { view: viewIndex, section: index };
    }
    if ((node as Element).localName === 'hui-dialog-edit-card') {
      const place = dialogPlace(node as Element);
      return place?.view !== undefined && place.section !== undefined
        ? { view: place.view, section: place.section }
        : undefined;
    }
  }
  return undefined;
}

import {
  diagnoseInstance,
  validateDeclared,
  declarationSelector,
  groupDeclarations,
  isCardDeclaration,
  diagnoseTemplate,
  forEachItems,
  forEachNames,
  forEachVariables,
  getDeclarations,
  inheritableVariables,
  mergeVariables,
  ownVariables,
  POSITION_NAMES,
  hasRequiredVariables,
  templateDefaults,
  usesResolver,
  usesTranslate,
  variableName,
  variableValues,
  VariableDeclaration,
  withInheritedVariables,
  withStateScope,
} from './variables';
import {
  chainOf,
  chainWith,
  describeCycle,
  describeTooDeep,
  findCycle,
  MAX_NESTING,
  withChain,
  withInherited,
  withoutStamps,
} from './cycles';
import { columnsFor, eagerCopies, LAZY_MARGIN, placeholderHeight } from './layout';
import { checkExamples, exampleSets, exampleVariables } from './examples';
import { customTags, OnError, onErrorOf, undefinedElements } from './on-error';
import { entitySuggestions, publishedStub, publishedTemplates } from './picker';
import {
  isRegistrySource,
  registryKey,
  registryNames,
  resolveRegistryItems,
  sameRegistry,
  SourceContext,
} from './registry';
import { loadLabels } from './labels';
import { categoryRegistry, loadCategories, wantsCategories, whenCategoriesChange } from './categories';
import { renderTemplateOnce, sourceTemplate, TemplateRender, templateList } from './template-source';
import {
  dashboardWantsLabels,
  findRepeatingCard,
  generateDashboard,
  generateView,
  renderStrategyTemplates,
  sectionPerCopy,
  wantsLabels,
} from './strategy';
import { copyText, getDashboardPath, getLovelace, getLovelaceConfig, getLovelacePanel } from './utils';
import { localize } from './localize';
import { REBUILD_DEBOUNCE_MS, rebuildOnEntities, rebuildOnRejects, stateSnapshot, statesMoved } from './rebuild';
import { VERSION } from './version';
import { toYaml } from './yaml';
import { renderDiff, renderDiffWithFull } from './diff-view';
import { definedNames, lintTemplate } from './lint';
import { checkUnreadVariables } from './unread';
import { CardValueMatch, TemplateValueMatch, searchValues } from './search';
import {
  MAX_DIFFERING,
  SimilarGroup,
  findSimilarCards,
  makeTemplateFromSimilar,
  similarReplacement,
  suggestTemplateName,
  templateFromSimilar,
} from './similar';
import {
  applyRewrite,
  dashboardKey,
  heldUndo,
  holdUndo,
  readDashboard,
  runUndo,
  Saver,
  UndoEntry,
  UndoOutcome,
} from './undo';
import {
  borrowsTemplate,
  affectedTemplates,
  nameTakenIn,
  renameVariableInDashboard,
  renameVariableInTemplate,
  validVariableName,
  variableNames,
} from './rename-variable';
import { formatReport } from './report';
import './group';
import {
  BUILD_LOG,
  BuildTrace,
  ExpansionResult,
  handedDownNames,
  logTrace,
  nestedCardPaths,
  newExpansionId,
  newTrace,
  reportExpansion,
  slowestBuilds,
  startExpansion,
  TracePlace,
  TraceReport,
  TraceRoot,
  traceRoot,
  TraceSection,
  traceLabel,
  tracePlace,
  variableRows,
  wantsTrace,
  withTrace,
} from './trace';

// Tags this bundle owns.
const CARD_TAG = 'decluttering-card-plus';
const CARD_EDITOR_TAG = 'decluttering-card-plus-editor';
const TEMPLATE_TAG = 'decluttering-template-plus';
const TEMPLATE_EDITOR_TAG = 'decluttering-template-plus-editor';
// Home Assistant finds a custom view strategy by this tag, from `type: custom:decluttering-card-plus`.
const STRATEGY_TAG = 'll-strategy-view-decluttering-card-plus';
// And a dashboard strategy by this one, from the same type written on the dashboard itself.
const DASHBOARD_STRATEGY_TAG = 'll-strategy-dashboard-decluttering-card-plus';
// A copy of a `lazy: true` repeat that is waiting to come into view. Only ever written by
// the card itself, into the stack it lays its copies out in.
const LAZY_COPY_TAG = 'decluttering-card-plus-lazy';

// Tags of the original custom-cards/decluttering-card, claimed when it is not installed
// so that existing configurations keep working unchanged.
const LEGACY_CARD_TAG = 'decluttering-card';
const LEGACY_TEMPLATE_TAG = 'decluttering-template';

// What a template of each kind starts out as, when its type is chosen in the editor. One
// of these is kept and the rest removed, so switching the type swaps the body for a
// starter of the new kind - and leaves an existing body of the chosen kind alone.
const THING_STUBS: Record<string, unknown> = {
  card: { type: 'entity', entity: 'sun.sun' },
  badge: { type: 'entity', entity: 'sun.sun' },
  row: { entity: 'sun.sun' },
  element: { type: 'icon', icon: 'mdi:weather-sunny', style: { color: 'yellow' } },
};

// Declared variables get their own form field, and the prefix keeps a variable called
// "template" from colliding with the field that chooses the template.
const VARIABLE_FIELD_PREFIX = 'variable:';

// Past this many copies on one card a repeat is worth mentioning. Well above a house's
// worth of lights, so an ordinary dashboard never sees it.
const MANY_COPIES = 50;

// How many sets of similar cards the Where used tab offers, and how many cards of each it
// names - enough to recognise the set, few enough that a big dashboard does not fill the dialog.
const SIMILAR_SHOWN = 10;
const SIMILAR_MEMBERS_SHOWN = 8;

// How many places a value search lists in each group before it stops.
const SEARCH_SHOWN = 50;

// How many matches the editor lists before it stops. Enough to see the filter is right,
// few enough that a sweep of the whole house does not fill the dialog.
const MATCHES_SHOWN = 12;

// One shared instance, built on first use so it speaks the user's language: the editor
// re-renders on every state change Home Assistant sends, and a fresh schema object each
// time would mark every field dirty for no reason.
let REPEAT_SCHEMA: unknown[] | undefined;
function repeatSchema(): unknown[] {
  REPEAT_SCHEMA ??= [
    {
      name: 'for_each',
      label: localize('editor.for_each_label'),
      helper: localize('editor.for_each_helper'),
      selector: { object: {} },
    },
    {
      name: 'for_each_from',
      label: localize('editor.for_each_from_label'),
      helper: localize('editor.for_each_from_helper'),
      selector: { object: {} },
    },
    {
      name: 'gap',
      label: localize('editor.gap_label'),
      helper: localize('editor.gap_helper'),
      selector: { number: { min: 0, max: 64, mode: 'box' } },
    },
    {
      name: 'empty',
      label: localize('editor.empty_label'),
      helper: localize('editor.empty_helper'),
      selector: { object: {} },
    },
    {
      name: 'columns',
      label: localize('editor.columns_label'),
      helper: localize('editor.columns_helper'),
      selector: { number: { min: 1, max: 6, mode: 'box' } },
    },
    {
      name: 'min_column_width',
      label: localize('editor.min_column_width_label'),
      helper: localize('editor.min_column_width_helper'),
      selector: { number: { min: 50, max: 1000, step: 10, mode: 'box' } },
    },
    {
      name: 'lazy',
      label: localize('editor.lazy_label'),
      helper: localize('editor.lazy_helper'),
      selector: { boolean: {} },
    },
    {
      name: 'lazy_eager',
      label: localize('editor.lazy_eager_label'),
      helper: localize('editor.lazy_eager_helper'),
      selector: { number: { min: 0, max: 100, mode: 'box' } },
    },
  ];
  return REPEAT_SCHEMA;
}

// Offered for every template, described or not, since it is about where the card sits
// rather than about what the template contains.
let FIT_SCHEMA: unknown[] | undefined;
function fitSchema(): unknown[] {
  FIT_SCHEMA ??= [
    {
      name: 'fit',
      label: localize('editor.fit_label'),
      helper: localize('editor.fit_helper'),
      selector: {
        select: {
          mode: 'dropdown',
          options: [
            { value: 'box', label: localize('editor.fit_box') },
            { value: 'contents', label: localize('editor.fit_contents') },
          ],
        },
      },
    },
  ];
  return FIT_SCHEMA;
}

/**
 * Splits a translated sentence at the one part that has to be rendered as markup - a
 * link, a `<code>` - so the words either side stay in the translator's order.
 */
// Whether this browser has a custom card's element, which is what decides if it will render.
const isDefinedHere = (tag: string): boolean => !!customElements.get(tag);

/** Whether a risk scan found anything worth a sentence. */
const anyRisk = (risks: CommunityRisks): boolean =>
  risks.actions.length > 0 || risks.urls.length > 0 || risks.embeds || risks.scripts || risks.placeholders;

/** What `latest` would let a post do that `installed` already does not: the risks that are new with this version. */
function newRisks(latest: CommunityRisks, installed: CommunityRisks): CommunityRisks {
  return {
    actions: latest.actions.filter((each) => !installed.actions.includes(each)),
    urls: latest.urls.filter((each) => !installed.urls.includes(each)),
    embeds: latest.embeds && !installed.embeds,
    scripts: latest.scripts && !installed.scripts,
    placeholders: latest.placeholders && !installed.placeholders,
  };
}

// The second press of a two-press button has to be a second decision, not the other half
// of a double-click: a press this soon after the first is the same press.
const SECOND_PRESS_MS = 500;

function splitAt(sentence: string, token: string): [string, string] {
  const at = sentence.indexOf(token);
  return at === -1 ? [sentence, ''] : [sentence.slice(0, at), sentence.slice(at + token.length)];
}

interface TextFieldOptions {
  label: string;
  value: string;
  disabled?: boolean;
  onInput: (value: string) => void;
  onKeydown?: (ev: KeyboardEvent) => void;
}

/*
 * A one-line text input. Home Assistant 2026.7 stopped registering ha-textfield and draws
 * its inputs with ha-input instead; an unregistered element is an empty inline box, so
 * every name field in the editors simply vanished, with nothing in the console. The
 * card still supports Home Assistants that only have ha-textfield, so this asks which one
 * the page has each time it draws. Both take `value`, `label` and `disabled`, and both send
 * `input` with the element as the target, so the rest is the same either way.
 */
function textField(options: TextFieldOptions): TemplateResult {
  const changed = (ev: Event): void => options.onInput((ev.target as HTMLInputElement).value ?? '');
  const keydown = (ev: KeyboardEvent): void => options.onKeydown?.(ev);
  return isDefinedHere('ha-input')
    ? html`<ha-input
        label=${options.label}
        .value=${options.value}
        .disabled=${options.disabled === true}
        @input=${changed}
        @keydown=${keydown}
      ></ha-input>`
    : html`<ha-textfield
        label=${options.label}
        .value=${options.value}
        .disabled=${options.disabled === true}
        @input=${changed}
        @keydown=${keydown}
      ></ha-textfield>`;
}

// The words a typed boolean's switch shows as on; every other word shows it off.
const TRUE_WORDS = new Set(['true', 'yes', 'on', '1']);

// A style rule that paints on this card's own host rather than on the card inside it.
const HOST_SELECTOR = /:host|\.decluttering-container/;

/*
 * Home Assistant's `title` translations - every integration's name - asked for once per
 * page and language, by the first card that uses `|translate`. Per language because they
 * are loaded for the language of the moment: switch it, and the names in the new one have
 * to be asked for again, or every `|translate` stays in the old one until a reload. A Home
 * Assistant without the call, or one where it fails, leaves `|translate` giving back what it
 * was given, as it always may.
 */
const titleTranslations = new Map<string, Promise<void>>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function loadTitleTranslations(hass: any): Promise<void> {
  if (typeof hass?.loadBackendTranslation !== 'function') return Promise.resolve();
  const language = String(hass?.locale?.language ?? hass?.language ?? '');
  const asked = titleTranslations.get(language);
  if (asked) return asked;
  const loading = Promise.resolve(hass.loadBackendTranslation('title')).then(
    () => undefined,
    () => {
      // Not fatal, and worth another try on the next card.
      titleTranslations.delete(language);
    },
  );
  titleTranslations.set(language, loading);
  return loading;
}

// Variables can be written as a list of entries or as one mapping; both are read the same
// way. Anything else - a string, a number - is neither, and worth saying so about.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isVariablesShape(value: any): boolean {
  return value === undefined || Array.isArray(value) || (!!value && typeof value === 'object');
}

/** Writes a value the editor produced, leaving the key out entirely when it is empty. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOrDelete(config: any, key: string, value: any): void {
  const empty = value === undefined || value === '' || (Array.isArray(value) && value.length === 0);
  if (empty) delete config[key];
  else config[key] = value;
}

/*
 * Which of its examples each template's preview is drawn with, picked in the template
 * editor. The editor and the preview are two separate elements Home Assistant makes from
 * the same config, and the choice is not part of the config - saving it would change the
 * dashboard for a look at a preview - so it is kept here, and the preview told by event.
 */
const previewExamples = new Map<string, number>();
const PREVIEW_EXAMPLE_EVENT = 'decluttering-card-plus-preview-example';

/** The dashboard on the page, by url path - the original dashboard is `lovelace`. */
function pageDashboard(): string {
  return dashboardKey(document.location.pathname.split('/').filter(Boolean)[0]);
}

/** What a rewrite saves through, read fresh each time: the page can change under an open dialog. */
function saverFor(hass: HomeAssistant | undefined): Saver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { ownPath: pageDashboard(), panel: getLovelacePanel(), hass: hass as any };
}

/*
 * A toast, the way Home Assistant shows its own. Fired at the root rather than at the editor
 * that asked: the toast's own button can outlive the dialog it came from, and an event fired
 * from an element no longer on the page reaches nobody.
 */
function toast(from: HTMLElement, detail: Record<string, unknown>): void {
  const target = document.querySelector('home-assistant') ?? from;
  target.dispatchEvent(new CustomEvent('hass-notification', { detail, bubbles: true, composed: true }));
}

/** What an operation is called, in a sentence about undoing it. */
function operationLabel(operation: string, hass?: HomeAssistant): string {
  return localize(`undo.op.${operation}`, undefined, hass);
}

/*
 * Every tool that rewrites a dashboard saves through here, so every one of them can be
 * undone the same way: the configuration of each dashboard it changes is kept before it is
 * saved (see undo.ts), and a toast offers the way back straight away. `dialog` is what the
 * edit dialog held before, for a tool that changed that too - an undo made while the dialog
 * is still open puts it back as well, or saving the dialog would undo the undo.
 */
async function rewriteDashboards(
  from: HTMLElement,
  hass: HomeAssistant | undefined,
  operation: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes: { urlPath: string; build: (config: any) => unknown }[],
  dialog?: unknown,
): Promise<UndoEntry | undefined> {
  const entry = await applyRewrite(saverFor(hass), operation, changes);
  if (!entry) return entry;
  if (dialog !== undefined) {
    entry.dialog = dialog;
    holdUndo(entry);
  }
  toast(from, {
    message: localize('undo.toast', { operation: operationLabel(operation, hass) }, hass),
    action: { text: localize('undo.action', undefined, hass), action: () => void undoFrom(from, hass, entry, false) },
    duration: 10000,
  });
  return entry;
}

/**
 * Undoes `entry`, from a toast or a button, and says how it went. Somebody having saved the
 * dashboard since is not overwritten without asking: the toast asks, and its button says so.
 */
async function undoFrom(
  from: HTMLElement,
  hass: HomeAssistant | undefined,
  entry: UndoEntry,
  force: boolean,
  // A button with room for a warning of its own asks there rather than in a toast.
  askInToast = true,
): Promise<UndoOutcome | undefined> {
  const operation = operationLabel(entry.operation, hass);
  // A newer rewrite has taken its place; undoing this one now would undo the wrong thing.
  if (heldUndo()?.at !== entry.at) {
    toast(from, { message: localize('undo.gone', { operation }, hass) });
    return undefined;
  }
  let outcome: UndoOutcome;
  try {
    outcome = await runUndo(saverFor(hass), entry, force);
  } catch (err) {
    toast(from, { message: localize('undo.failed', { message: (err as Error)?.message ?? err }, hass) });
    return undefined;
  }
  if (outcome.result === 'changed') {
    if (!askInToast) return outcome;
    toast(from, {
      message: localize('undo.changed', { operation, dashboards: outcome.dashboards.join(', ') }, hass),
      action: { text: localize('undo.anyway', undefined, hass), action: () => void undoFrom(from, hass, entry, true) },
      duration: 15000,
    });
    return outcome;
  }
  if (outcome.result === 'done' && entry.dialog !== undefined && from.isConnected) {
    fireEvent(from, 'config-changed', { config: entry.dialog as Record<string, unknown> });
  }
  toast(from, {
    message: localize(outcome.result === 'done' ? 'undo.done' : 'undo.nothing', { operation }, hass),
  });
  return outcome;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HELPERS = (window as any).loadCardHelpers ? (window as any).loadCardHelpers() : undefined;

console.info(
  `%c DECLUTTERING-CARD-PLUS \n%c   Version ${VERSION}   `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

async function loadCardEditorPicker(): Promise<void> {
  // Ensure hui-card-element-editor and hui-card-picker are loaded.
  // They happen to be used by the vertical-stack card editor but there must be a better way?
  let cls = customElements.get('hui-vertical-stack-card');
  if (!cls) {
    (await HELPERS).createCardElement({ type: 'vertical-stack', cards: [] });
    await customElements.whenDefined('hui-vertical-stack-card');
    cls = customElements.get('hui-vertical-stack-card');
  }
  if (cls) cls = cls.prototype.constructor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (cls && (cls as any).getConfigElement) await (cls as any).getConfigElement();
}

async function loadRowEditor(): Promise<void> {
  // Ensure hui-row-element-editor are loaded.
  // They happen to be used by the vertical-stack card editor but there must be a better way?
  let cls = customElements.get('hui-entities-card');
  if (!cls) {
    (await HELPERS).createCardElement({ type: 'entities', entities: [] });
    await customElements.whenDefined('hui-entities-card');
    cls = customElements.get('hui-entities-card');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (cls && (cls as any).getConfigElement) await (cls as any).getConfigElement();
}

// The things a template can define, exactly one of which it must. A group is a kind of card.
const THING_TYPE_KEYS = ['card', 'row', 'element', 'badge', 'group'];

/*
 * A picture element is centred on its position and clipped by the card it sits in, so an
 * element's debug view - far bigger than the icon it stands in for - lost its top and
 * bottom, with no way to scroll to them (discussion #150). In debug it covers the card
 * from the top-left corner instead, and scrolls when the config is longer than that.
 */
const DEBUG_ELEMENT_STYLE: Record<string, string> = {
  top: '0',
  left: '0',
  transform: 'none',
  width: '100%',
  height: '100%',
  overflow: 'auto',
  'z-index': '1',
};

/*
 * How a card using `template_by_domain:` chooses each copy's template, from that copy's
 * variables. Kept with the card so that a rebuild - the registry moving, a resolver's answer
 * arriving - chooses again the same way.
 */
interface TemplatePicker {
  pick(variables: VariablesConfig[] | undefined): { name: string; template: TemplateConfig; entity?: string };
  /** Whether any template it can choose reads the registry through a resolver. */
  resolvers: boolean;
}

function getThingType(templateConfig: TemplateConfig): LovelaceThingType | undefined {
  const thingTypes = Object.keys(templateConfig).filter((key) => THING_TYPE_KEYS.includes(key));
  if (thingTypes.length !== 1) return undefined;
  return thingTypes[0] === 'group' ? 'card' : (thingTypes[0] as LovelaceThingType);
}

// What a template builds, before its variables are put in. A group builds the card that lays it out.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function thingContent(templateConfig: TemplateConfig): any {
  if (templateConfig.group !== undefined) return groupCard(templateConfig.group);
  return templateConfig.card ?? templateConfig.element ?? templateConfig.row ?? templateConfig.badge;
}

abstract class DeclutteringElement extends LitElement {
  @state() protected _hass?: HomeAssistant;
  @state() private _thing?: LovelaceThing;

  // Home Assistant sets both of these on a card element directly. They are declared so
  // that assigning them triggers an update, which is what passes them on to the wrapped
  // card - a preview has to render whether or not its visibility conditions are met, and
  // the layout tells the card whether it is in a section or a panel.
  @property({ type: Boolean }) public preview = false;
  @property({ attribute: false }) public layout?: string;
  /*
   * Home Assistant hands `preview` to a card element, but not to a badge element:
   * hui-badge reads its own `preview` to decide whether to ignore `visibility`, and
   * never passes it on to the badge it built. So a badge made from a template was the
   * one thing on a dashboard that stayed hidden while the dashboard was being edited,
   * with no way to select it and no sign it was there at all - upstream issue #117.
   *
   * The wrapper does know, so it is read from there instead. Only the badge path needs
   * this; a card already gets told.
   */
  @state() private _wrapperPreview = false;

  protected _thingConfig?: LovelaceThingConfig;
  protected _thingType?: LovelaceThingType;
  // One observer for the element's lifetime. A new one per wrapped card leaked a live
  // observer on every reconfigure, and left them all running after the card was gone.
  private _resizes?: ResizeObserver;
  // The template this element renders, and the ones already open above it. Together they
  // are what stops a template that uses itself from building levels forever.
  protected _templateName?: string;
  protected _gridOptions?: unknown;
  protected _strict = false;
  // `debug: console`: the card renders as normal and logs how it was built (#160).
  protected _trace = false;
  // What this card's console entry calls it, and where a logging card around it put it.
  protected _traceLabel?: string;
  protected _tracePlace?: TracePlace;
  // The outermost logging card this one reports what it built to, when it is nested in one.
  protected _traceRoot?: TraceRoot;
  // Which of the card's variables were handed down to it, so the log can say so.
  protected _handedDown: string[] = [];
  @state() protected _debug: false | 'json' | 'yaml' = false;
  // `debug: report` (#207): the card renders as normal, with its build written out underneath to copy.
  protected _reportMode = false;
  // This card's own entry from its last build, and which build the report on show belongs to.
  protected _lastReport?: TraceReport;
  private _reportFor?: string;
  @state() protected _reportResult?: ExpansionResult;
  private _reportCache?: { result: ExpansionResult; error?: string; text: string };
  @state() private _reportCopied = false;
  protected _openTemplates: string[] = [];
  // The entities this card rebuilds on, which are also the only ones `|state` can read.
  protected _rebuildOn: string[] = [];
  // The copies of a repeated template, kept so the layout can change without resolving
  // them again, and the column count currently on show so it only rebuilds when it moves.
  private _forEach?: {
    cards: unknown[];
    max: number;
    minWidth?: number;
    styles: string;
    group: boolean;
    // Each copy already told which template it was built from, which differs copy to copy
    // when the card chooses by domain - so the whole must not be told one name over the top.
    chained: boolean;
  };
  private _columnsShown?: number;
  // The size a repeat was last mentioned at, so a rebuild does not say it all over again.
  private _manyWarnedFor?: number;
  // Whether the copies on show include some still waiting to come into view.
  protected _lazyShown = false;
  private _widths?: ResizeObserver;
  private _savedStyles?: Map<string, [string, string]>;
  @state() private _style?: string;

  @state() protected _error?: string;

  /** Whether this card was asked to give up its box in the layout. */
  @state() protected _fitContents = false;

  // The section this element was last found in, once it has been on the page.
  protected _section?: SectionPlace;
  // Set when the last build kept quiet about unset variables because the section, which
  // may well give them, was not known yet - see _placeUnsettled.
  protected _builtQuietly = false;
  // What the builds of one config have said in the console, so building it again says only
  // what is new - see _saidFor.
  private _said?: { config: unknown; messages: Set<string> };
  // The wrapped card a sections view has been told the size of.
  private _sizeAnnounced?: LovelaceThing;

  set hass(hass: HomeAssistant) {
    if (!hass) return;
    this._hass = hass;
    if (this._thing) this._thing.hass = hass;
    this.hassAvailable(hass);
  }

  /** hass as a build reads it: allowed the state of what this card rebuilds on, and nothing else. */
  protected get _buildHass(): HomeAssistant | undefined {
    return withStateScope(this._hass, this._rebuildOn);
  }

  // Overridden by the card, which may need the connection to fetch a template that lives
  // on another dashboard. setConfig runs before hass is ever set, so the work waits here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected hassAvailable(_hass: HomeAssistant): void {}

  /*
   * The view and section whose decluttering_defaults and decluttering_let apply. The section, when known, also
   * says which view - more surely than the URL does. Before the card is on the page there
   * is only the URL.
   */
  protected _place(ll: Parameters<typeof viewIndexFromPath>[0]): { view?: number; section?: number } {
    if (this._section) return { view: this._section.view, section: this._section.section };
    // A preview in the edit dialog: the view of the card being edited.
    const dialog = editDialogOf(this);
    const fromDialog = dialog ? dialogPlace(dialog) : undefined;
    if (fromDialog?.view !== undefined) return { view: fromDialog.view };
    return { view: currentViewIndex(ll) };
  }

  // Overridden to build again with the config last given. Only called when a section on
  // one side of the move has values of its own, as otherwise nothing would change.
  protected _rebuild(): void {}

  /*
   * A card with rebuild_on: builds again every time a state it watches changes, and each
   * build said the same thing in the console again - a |state of an entity it does not
   * list, say, once a second on a busy sensor. Each config's warnings are said once; the
   * same config built again only says what it has not said already, and a new one (an
   * edit) starts afresh.
   */
  protected _saidFor(config: unknown): Set<string> {
    const said = this._said;
    if (said && said.config === config) return said.messages;
    const messages = new Set<string>();
    this._said = { config, messages };
    return messages;
  }

  /*
   * Whether a build now would be a guess at the card's section. setConfig builds before the
   * card is on the page, so in a sections view where some section has a decluttering_let or
   * decluttering_defaults, the first build lacks them and said `[[slet]]` had no value - a
   * moment before the build on the page gave it one. That build keeps quiet instead, and the
   * card builds again once it is on the page, saying whatever is still true then.
   */
  protected get _placeUnsettled(): boolean {
    if (this._section || this.isConnected) return false;
    const ll = getLovelaceConfig();
    const view = currentViewIndex(ll);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sections: unknown[] = view === undefined ? [] : ((ll as any)?.views?.[view]?.sections ?? []);
    return (
      Array.isArray(sections) &&
      sections.some((_, section) => hasSectionDefaults(ll, { view: view as number, section }))
    );
  }

  /*
   * Set while a card's `on_error: hide` stands in for a card that could not be built: it
   * counts as hidden, so it gives up its place the way a card hiding itself does.
   */
  protected _hiddenByFallback = false;

  // Told every config this element has just been handed to build, for a card to look over.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected _afterResolved(_config: LovelaceThingConfig): void {}

  // Forgets the copies of a repeat, so a change of width cannot lay them out over what replaced them.
  protected _stopRepeat(): void {
    this._forEach = undefined;
    this._widths?.disconnect();
  }

  static get styles(): CSSResult {
    return css`
      /*
       * A badge belongs to the flex row of badges, so this wrapper has to get out of the
       * way rather than box it. Styles injected with the style option still reach the
       * badge, but cannot paint on the wrapper itself.
       */
      :host(.decluttering-badge) {
        display: contents;
      }
      :host(.decluttering-container) {
        display: block;
      }
      .debug {
        padding: 12px 16px;
        text-align: start;
      }
      .debug p {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      /*
       * A card that handles taps - button-card, Mushroom - turns text selection off, and
       * the wrapped debug view would inherit that and could not be copied out (#156). The
       * same cards centre their text, which is what the start alignment above undoes.
       */
      .debug pre {
        margin: 0;
        -webkit-user-select: text;
        user-select: text;
        cursor: text;
        overflow: auto;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.85em;
        white-space: pre-wrap;
        word-break: break-word;
      }
      /*
       * The host is an extra level between the layout and the wrapped card, so a card
       * sized against its container - fill_container on a tile, for example - would
       * otherwise measure itself against this wrapper's content height instead of the
       * space the layout gave it. Against an auto-height parent this resolves to auto,
       * so it changes nothing outside sized containers.
       *
       * Only a card is laid out that way. A picture-elements element is positioned
       * absolutely inside the card, where height: 100% stretches it over the whole
       * image instead of leaving it the size of its icon.
       */
      :host(.decluttering-card) {
        height: 100%;
      }
      /* The report sits under the card, outside the space the layout gave it. */
      :host(.decluttering-report) {
        height: auto;
      }
      .report {
        margin-top: 8px;
        padding: 12px 16px;
      }
      .report p {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .report .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
      }
      .report pre {
        margin: 8px 0 0;
        max-height: 400px;
        -webkit-user-select: text;
        user-select: text;
        cursor: text;
        overflow: auto;
        font-family: var(--ha-font-family-code, monospace);
        font-size: 0.8em;
        white-space: pre-wrap;
        word-break: break-word;
      }
      /*
       * A card that sizes itself - a button-card given a width, say - is narrower than the
       * share of a row this wrapper is handed, and sits at the left of it, so a stack of
       * them ends up spread out instead of packed together. Asking it to fit its contents takes the
       * wrapper out of the layout so the card becomes the stack's own child and lays out
       * as it would without any of this.
       *
       * Not the default, and it cannot be: with no box there is nothing for the style
       * option to paint on, and the height above stops applying.
       */
      :host(.decluttering-fit-contents) {
        display: contents;
      }
      /*
       * Last, and it has to stay last. Every rule here is :host(.one-class), so they all
       * have the same specificity and the later one wins - which meant a hidden card kept
       * the display: block above and went on holding its place in the layout. It looked
       * right in a masonry view, where a zero-height block leaves no visible gap, and
       * wrong in a horizontal-stack, where it still took a full share of the row and
       * squeezed the cards either side of it.
       */
      :host(.child-card-hidden) {
        display: none;
      }
    `;
  }

  protected firstUpdated(): void {
    this.updateComplete.then(() => {
      this._displayHidden();
    });
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    // Cheap, and it catches a wrapper that was told about edit mode without the badge
    // being moved - whichever way round a future Home Assistant does it.
    this._syncWrapperPreview();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const thing = this._thing as any;
    if (!thing) return;
    if ('preview' in thing) {
      const previewing = this._previewing;
      if (thing.preview !== previewing) {
        thing.preview = previewing;
        /*
         * Whether the wrapped thing is hidden is otherwise noticed by watching it resize,
         * and a thing that is being un-hidden inside a host that is still display: none
         * never gets a size to report. Without this the host would stay hidden and the
         * badge it now holds would never be seen.
         */
        Promise.resolve(thing.updateComplete).then(() => this._displayHidden());
      }
    }
    if ('layout' in thing) thing.layout = this.layout;
  }

  /** True while the dashboard is being edited, however this element was told about it. */
  private get _previewing(): boolean {
    return this.preview || this._wrapperPreview;
  }

  /*
   * Reads edit mode off the hui-badge this element sits in. Nothing tells the element
   * when that changes, so it is read again every time Home Assistant moves the badge -
   * which is exactly what entering and leaving edit mode does, as the badge is put
   * inside a hui-badge-edit-mode wrapper and taken back out again. The frame after is
   * read too, because the move and the flag are not set in a guaranteed order.
   */
  private _syncWrapperPreview(): void {
    const wrapper = this.parentElement;
    if (!wrapper || wrapper.localName !== 'hui-badge') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this._wrapperPreview = (wrapper as any).preview === true;
  }

  // A wrapped card can hide itself with an inline style, a stylesheet rule or the hidden
  // attribute. Only the first of those was checked before, so a card hiding itself by any
  // other means left this wrapper occupying space in the layout - upstream issue #58.
  private _childIsHidden(): boolean {
    if (this._hiddenByFallback) return true;
    const thing = this._thing;
    if (!thing) return false;
    if (thing.hasAttribute('hidden')) return true;
    // `display` is not inherited, so this stays correct even while the host is hidden.
    return getComputedStyle(thing).display === 'none';
  }

  protected _displayHidden(): void {
    if (this._childIsHidden()) {
      this.classList.add('child-card-hidden');
    } else if (this.classList.contains('child-card-hidden')) {
      this.classList.remove('child-card-hidden');
    }
  }

  protected _setTemplateConfig(
    templateConfig: TemplateConfig,
    variables: VariablesConfig[] | undefined,
    cardStyle?: string,
    templateName?: string,
    instance?: DeclutteringCardConfig,
  ): void {
    const thingType = getThingType(templateConfig);
    if (!thingType) {
      const defined = THING_TYPE_KEYS.filter((key) => (templateConfig as Record<string, unknown>)[key] !== undefined);
      throw new Error(
        defined.length
          ? localize('error.defines_both', { first: defined[0], second: defined[1] }, this._hass)
          : localize('error.defines_nothing', undefined, this._hass),
      );
    }
    this._templateName = templateName ?? this._templateName;
    const content = thingContent(templateConfig);
    const unresolved: string[] = [];
    // Only a card that uses a template has variables to hand down; a template's own preview does not.
    const inherited = instance ? (): unknown[] => this._handDown(variables, templateConfig, templateName) : undefined;
    // Only a card using a template logs; a template's own preview has nothing to say.
    const trace = this._trace && instance ? newTrace() : undefined;
    if (trace)
      this._traceLabel = traceLabel(
        templateName ?? '',
        this._traceName(variables, templateConfig, templateName, instance),
      );
    const started = performance.now();
    const quiet = !!instance && this._placeUnsettled;
    this._builtQuietly = quiet;
    const built = applyOverride(
      deepReplace(
        variables,
        templateConfig,
        content,
        templateName,
        this._buildHass,
        quiet || this._saidFor(instance ?? templateConfig),
        (names) => unresolved.push(...names),
        0,
        trace,
      ),
      instance,
      thingType,
    );
    const styles = this._resolveStyles(templateConfig, variables, cardStyle, templateName, trace);
    // Every card's build is noted for the health panel; a template's own preview is not a card.
    if (instance) this._noteBuild(templateName ?? '', instance, 1, started);
    if (trace) {
      this._logBuild(
        started,
        [{ variables: variableRows(variables, templateConfig, this._handedDown), trace, built: withoutStamps(built) }],
        templateConfig,
      );
    }
    this._setResolved(thingType, built, styles, inherited);
    // Strict is held to the build on the page too, which knows the section.
    if (!quiet) this._refuseIfStrict(unresolved);
  }

  // The health panel's note of this build: which template, the card's own name, how many copies, how long.
  private _noteBuild(template: string, config: DeclutteringCardConfig, copies: number, started: number): void {
    BUILD_LOG.add({
      template,
      ...(typeof config.name === 'string' && config.name ? { name: config.name } : {}),
      copies,
      ms: performance.now() - started,
    });
  }

  private _logBuild(started: number, sections: TraceSection[], templateConfig: TemplateConfig): void {
    const report: TraceReport = {
      label: this._traceLabel ?? traceLabel(this._templateName ?? ''),
      chain: this._traceParents(),
      at: this._tracePlace?.at,
      ms: performance.now() - started,
      sections,
      template: { name: this._templateName ?? '', config: withoutStamps(templateConfig) },
    };
    logTrace(report, this._hass);
    // Kept for the outermost card's report, which this card's entry goes into once it has built.
    this._lastReport = report;
  }

  /*
   * The report on show for `debug: report`, once the cards inside have built. A card inside
   * another logging card reports to that one, so its own report only covers its own build.
   */
  private _showReport(id: string | undefined, result: ExpansionResult): void {
    if (id === this._reportFor) this._reportResult = result;
  }

  // Written out when it is shown rather than when the build finishes: `strict:` refuses after that.
  private get _reportText(): string | undefined {
    const result = this._reportResult;
    if (!result) return undefined;
    const cached = this._reportCache;
    if (cached && cached.result === result && cached.error === this._error) return cached.text;
    const hass = this._hass as unknown as {
      config?: { version?: string };
      locale?: { language?: string };
      language?: string;
    };
    const lovelace = getLovelace() as unknown as { mode?: string } | null;
    const text = formatReport(
      {
        context: {
          version: VERSION,
          haVersion: hass?.config?.version,
          dashboard: lovelace?.mode,
          language: hass?.locale?.language ?? hass?.language,
          browser: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        },
        reports: result.reports,
        full: result.full === undefined ? undefined : withoutStamps(result.full),
        neverBuilt: result.neverBuilt,
        error: this._error,
      },
      this._hass,
    );
    this._reportCache = { result, error: this._error, text };
    return text;
  }

  private async _copyReport(): Promise<void> {
    if (!this._reportText) return;
    this._reportCopied = await copyText(this._reportText);
    if (this._reportCopied) setTimeout(() => (this._reportCopied = false), 2000);
  }

  private _downloadReport(): void {
    if (!this._reportText) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([this._reportText], { type: 'text/markdown' }));
    link.download = `decluttering-${(this._templateName ?? 'card').replace(/[^\w-]+/g, '_')}-debug.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  private _renderReport(): TemplateResult | string {
    if (!this._reportMode) return '';
    const ready = this._reportText !== undefined;
    return html`
      <ha-card class="report">
        <p>
          ${localize(ready ? 'report.ready' : 'report.waiting', undefined, this._hass)}
          ${localize('report.check', undefined, this._hass)}
        </p>
        <div class="actions">
          <ha-button .disabled=${!ready} @click=${this._copyReport}>
            ${localize(this._reportCopied ? 'report.copied' : 'report.copy', undefined, this._hass)}
          </ha-button>
          <ha-button .disabled=${!ready} @click=${this._downloadReport}>
            ${localize('report.download', undefined, this._hass)}
          </ha-button>
        </div>
        ${
          ready
            ? html`<details>
                <summary>${localize('report.show', undefined, this._hass)}</summary>
                <pre>${this._reportText}</pre>
              </details>`
            : ''
        }
      </ha-card>
    `;
  }

  /** The cards around this one as the console names them, or the templates open above it when none of them is logging. */
  private _traceParents(): string[] {
    return this._tracePlace?.parents ?? this._openTemplates.map((template) => traceLabel(template));
  }

  // A card's own `name:` beats its template's, and either is filled in with this card's values.
  private _traceName(
    variables: VariablesConfig[] | undefined,
    templateConfig: TemplateConfig,
    templateName: string | undefined,
    instance: DeclutteringCardConfig | undefined,
  ): string | undefined {
    const name = instance?.name ?? templateConfig.name;
    if (typeof name !== 'string') return undefined;
    const filled = deepReplace(variables, templateConfig, name, templateName, this._buildHass, true);
    return typeof filled === 'string' ? filled : undefined;
  }

  /*
   * Nothing here normally stops a card rendering: a template can be edited after the cards
   * that use it, so a card that looks wrong now may be right in a moment. Somebody building
   * a template for other people wants the opposite, and `strict: true` is how they say so.
   */
  protected _refuseIfStrict(unresolved: string[]): void {
    if (!this._strict || !unresolved.length) return;
    const which = unresolved.map((name) => `[[${name}]]`).join(', ');
    this._error = localize(unresolved.length === 1 ? 'error.strict_one' : 'error.strict_many', { which }, this._hass);
  }

  // Styles always resolve against the real template config, so a declared default or a
  // `default:` entry reaches a style the same way it reaches the content.
  private _resolveStyles(
    templateConfig: TemplateConfig,
    variables: VariablesConfig[] | undefined,
    cardStyle?: string,
    templateName?: string,
    trace?: BuildTrace,
  ): string {
    // A name Home Assistant supplies is written into a declaration's value and kept there:
    // cssSafe takes out what would let it end the declaration and start its own.
    let styles = '';
    if (templateConfig.style) {
      styles += deepReplace(
        variables,
        templateConfig,
        templateConfig.style,
        templateName,
        this._buildHass,
        false,
        undefined,
        0,
        trace,
        cssSafe,
      );
    }
    if (cardStyle) {
      styles += deepReplace(
        variables,
        templateConfig,
        cardStyle,
        templateName,
        this._buildHass,
        false,
        undefined,
        0,
        trace,
        cssSafe,
      );
    }
    return styles;
  }

  /*
   * What this card hands down to a nested card that asks for its variables, with any
   * placeholders in them filled in here - in the nested card they would be read against
   * the wrong values. An optional placeholder that nothing fills drops its entry.
   */
  private _handDown(
    variables: VariablesConfig[] | undefined,
    templateConfig: TemplateConfig,
    templateName?: string,
  ): unknown[] {
    // Escapes stay in: these values are the nested card's variables, and it substitutes them.
    const list = deepReplace(
      variables,
      templateConfig,
      inheritableVariables(variables, templateConfig),
      templateName,
      this._buildHass,
      true,
      undefined,
      0,
      undefined,
      undefined,
      true,
    );
    return (Array.isArray(list) ? list : []).filter(
      (entry: unknown) => !!entry && typeof entry === 'object' && Object.keys(entry as object).length > 0,
    );
  }

  protected _setResolved(
    thingType: LovelaceThingType,
    thingConfig: LovelaceThingConfig,
    styles: string,
    inherited?: () => unknown[],
    alreadyChained = false,
  ): void {
    // A group in a view's row of badges lays its cards out as badges, and is one itself (#184).
    if (thingType === 'card' && thingConfig.type === GROUP_CARD_TYPE && this._inBadgeRow) {
      thingType = 'badge';
      thingConfig = { ...thingConfig, badges: true };
    }
    // Anything inside this card is told which templates are open above it, so a card that
    // ends up using a template already being drawn can refuse instead of going round again.
    const chained = alreadyChained
      ? thingConfig
      : withChain(thingConfig, chainWith(this._openTemplates, this._templateName));
    const label = this._traceLabel ?? traceLabel(this._templateName ?? '');
    const named = [...this._traceParents(), label];
    /*
     * The cards inside are told which card to report to and where they sit in it, so the
     * outermost one can log the whole thing once they have all built. Not while the debug
     * view is showing: that view is all that is drawn, so nothing inside it is ever built.
     */
    const expanding = this._trace && !this._debug;
    const root: TraceRoot | undefined = expanding ? (this._traceRoot ?? { id: newExpansionId(), path: [] }) : undefined;
    const stamped = withInherited(this._trace ? withTrace(chained, named, root) : chained, inherited);
    const nested = expanding ? nestedCardPaths(chained) : [];
    const report = this._lastReport;
    if (this._traceRoot) {
      reportExpansion(this._traceRoot, withoutStamps(chained), nested, report);
      if (this._reportMode) {
        this._reportFor = undefined;
        this._showReport(undefined, { reports: report ? [report] : [], neverBuilt: [] });
      }
    } else if (root) {
      const id = this._reportMode ? root.id : undefined;
      this._reportFor = id;
      if (id) this._reportResult = undefined;
      startExpansion(
        root.id,
        label,
        withoutStamps(chained),
        nested,
        this._hass,
        report,
        id ? (result): void => this._showReport(id, result) : undefined,
      );
    }
    this._style = styles;
    this._thingConfig = stamped;
    this._thingType = thingType;
    DeclutteringElement._createThing(stamped, thingType, (thing: LovelaceThing) => {
      if (this._thingConfig === stamped) {
        this._setThing(
          thing,
          thingType === 'element' ? (this._debug ? DEBUG_ELEMENT_STYLE : thingConfig.style) : undefined,
        );
      }
    });
    this._afterResolved(stamped);
  }

  /*
   * `for_each` renders the template once per item, which Home Assistant's own stack cards
   * already know how to lay out - so the copies are handed to a vertical-stack, or to a
   * grid when more than one column is asked for, rather than managed here. Everything
   * that applies to a single templated card then applies to each copy unchanged.
   */
  protected _setForEach(
    templateConfig: TemplateConfig,
    config: DeclutteringCardConfig,
    items: unknown[],
    picker?: TemplatePicker,
  ): void {
    /*
     * Each copy's template: the card's own, or - choosing by domain - the one its entity
     * picks, worked out from the copy's own values before anything else is done with it.
     */
    const chosen = items.map((item) => ({
      item,
      ...(picker
        ? picker.pick(forEachVariables(item, config.variables))
        : { name: config.template, template: templateConfig }),
    }));
    // Without choosing, the one template is checked whether or not there are copies, as it
    // always has been: a repeat of a row template is a mistake even while the list is empty.
    for (const copy of picker ? chosen : [{ name: config.template, template: templateConfig }]) {
      if (getThingType(copy.template) === 'card') continue;
      /*
       * Only a card can repeat. Home Assistant gives a row, a badge or a picture element a
       * single slot to fill, so there is nowhere for a second copy to go - the way to
       * repeat rows is a card template holding them, which repeats as a card like anything
       * else. Choosing by domain, every copy has to be a card for the same reason.
       */
      const kind = getThingType(copy.template) ?? localize('error.a_different_kind', undefined, this._hass);
      throw new Error(
        picker
          ? localize('error.by_domain_not_card', { template: copy.name, kind }, this._hass)
          : localize('error.for_each_not_card', { template: config.template, kind }, this._hass),
      );
    }
    /*
     * A template can say which of its variables it cannot do without, and an item that
     * leaves one of them empty describes a copy there is nothing to render - the third
     * light in a room that has two. Those items are dropped rather than rendered as a card
     * full of holes, which is what a dummy entity id was always standing in for.
     */
    const wanted = chosen.filter((copy) => hasRequiredVariables(copy.template, copy.item, config.variables));

    /*
     * A repeat that matches nothing renders nothing, which is right - a dashboard should
     * not break because a room has no motion sensor yet - but silence is indistinguishable
     * from breakage. `empty:` is how a card says "there is nothing here" on purpose.
     */
    if (!wanted.length && config.empty) {
      this._forEach = undefined;
      this._lazyShown = false;
      this._widths?.disconnect();
      this._setResolved(
        'card',
        config.empty as LovelaceThingConfig,
        this._resolveStyles(templateConfig, config.variables, config.style, config.template),
        () => this._handDown(config.variables, templateConfig, config.template),
      );
      return;
    }

    /*
     * A registry sweep that matches half the house builds half the house, which reads as a
     * broken dashboard rather than a big one. Said once, naming the count, because the card
     * cannot know whether it was meant - only that it is worth a look.
     */
    const repeatName = config.template ?? BY_DOMAIN_KEY;
    if (wanted.length > MANY_COPIES && this._manyWarnedFor !== wanted.length) {
      this._manyWarnedFor = wanted.length;
      // A repeat that is not lazy yet is pointed at the setting that helps (the _lazy
      // string); one that is already lazy only builds what is near the screen, so building
      // is not the trouble - it is told about the scrolling instead.
      const key = config.lazy === true ? 'warn.many_copies_scroll' : 'warn.many_copies_lazy';
      console.warn(localize(key, { template: repeatName, count: wanted.length }, this._hass));
    }

    // The card's own `card:` block is laid over every copy alike.
    // Each copy hands down its own item's values, so it is stamped here rather than as a whole.
    const started = performance.now();
    const sections: TraceSection[] = [];
    // Only the card's own name can stand for every copy; a template's names each copy apart.
    if (this._trace) {
      const own =
        config.name === undefined
          ? undefined
          : this._traceName(config.variables, templateConfig, config.template, config);
      this._traceLabel = traceLabel(repeatName, own);
    }
    // As for a single card: kept quiet until the section is known.
    const quiet = this._placeUnsettled;
    this._builtQuietly = quiet;
    const cards = wanted.map(({ item, name, template, entity }, index) => {
      // Underneath everything the copy sets: the entity its template was picked by, when
      // that came from the fallback template rather than the copy - see pickTemplate.
      const variables = withPickedEntity(
        forEachVariables(item, config.variables, index, wanted.length),
        entity,
      ) as VariablesConfig[];
      const trace = this._trace ? newTrace() : undefined;
      // What the item and its position set, as opposed to what the card set for every copy.
      // The item beats the card, and the card beats the position, as forEachVariables orders them.
      const names = (list: unknown): string[] => ownVariables(list).map((entry) => Object.keys(entry)[0]);
      const repeated = trace
        ? [
            ...names(item),
            ...['index', 'index0', 'count', 'first', 'last'].filter((each) => !names(config.variables).includes(each)),
          ]
        : [];
      const built = applyOverride(
        deepReplace(
          variables,
          template,
          thingContent(template),
          name,
          this._buildHass,
          quiet || this._saidFor(config),
          undefined,
          0,
          trace,
        ),
        config,
        'card',
      );
      if (trace) {
        const copyName = this._traceName(variables, template, name, config);
        const copy = localize('trace.copy', { number: index + 1, count: wanted.length }, this._hass);
        sections.push({
          label: copyName ? `${copy}: "${copyName}"` : copy,
          variables: variableRows(variables, template, this._handedDown, repeated),
          trace,
          built: withoutStamps(built),
        });
      }
      // Choosing by domain, a copy is told its own template is open above what it holds -
      // the card as a whole has no one name to tell it.
      const chained = picker ? withChain(built, chainWith(this._openTemplates, name)) : built;
      return withInherited(chained, () => this._handDown(variables, template, name));
    });
    this._noteBuild(config.template, config, cards.length, started);
    if (this._trace) this._logBuild(started, sections, templateConfig);

    /*
     * `lazy: true`: past the first few, each copy goes into the stack as a placeholder that
     * holds its place and creates the real card as it nears the screen. Substitution is
     * string work and has already happened; creating Home Assistant's card elements - and
     * whatever nested templates build inside them - is the cost this puts off. A preview
     * and debug see everything, and a group is laid out by the section a card at a time,
     * so a group never waits.
     */
    const buildAll = this.preview || !!this._debug || this._trace || templateConfig.group !== undefined;
    const eager = eagerCopies(cards.length, config.lazy, config.lazy_eager, buildAll);
    this._lazyShown = eager < cards.length;
    const laidOut = this._lazyShown
      ? cards.map((card, index) => (index < eager ? card : { type: `custom:${LAZY_COPY_TAG}`, card }))
      : cards;

    // The styles belong to the whole card rather than to any one copy, and resolve against
    // the real template so its declared defaults still apply. Choosing by domain, each
    // template chosen brings its own, and the card's own style comes once at the end.
    const styles = picker
      ? [...new Map(wanted.map((copy) => [copy.name, copy.template])).entries()]
          .map(([name, template]) => this._resolveStyles(template, config.variables, undefined, name))
          .join('') +
        this._resolveStyles({ ...templateConfig, style: undefined }, config.variables, config.style, config.template)
      : this._resolveStyles(templateConfig, config.variables, config.style, config.template);
    this._forEach = {
      cards: laidOut,
      max: Number(config.columns) || 1,
      minWidth: Number(config.min_column_width) || undefined,
      styles,
      group: picker
        ? wanted.length > 0 && wanted.every((copy) => copy.template.group !== undefined)
        : templateConfig.group !== undefined,
      chained: !!picker,
    };
    this._columnsShown = undefined;
    this._layoutForEach();
    if (this._forEach.minWidth) this._watchWidth();
    else this._widths?.disconnect();
  }

  /*
   * Lays the copies out at the number of columns the card is currently wide enough for.
   * Rebuilding is not free, so it happens only when that number actually moves - which,
   * with a minimum width, is when the card crosses a threshold rather than on every pixel.
   */
  private _layoutForEach(): void {
    const forEach = this._forEach;
    if (!forEach) return;

    const columns = columnsFor(this.clientWidth, forEach.max, forEach.minWidth);
    if (columns === this._columnsShown) return;
    this._columnsShown = columns;

    /*
     * A vertical-stack would undo what a group is for, laying every card in each copy out
     * one under another - so copies of a group go in a group of their own, which hands the
     * section's grid on to each of them.
     */
    const stack =
      columns > 1
        ? { type: 'grid', columns, square: false, cards: forEach.cards }
        : forEach.group
          ? groupCard(forEach.cards)
          : { type: 'vertical-stack', cards: forEach.cards };

    // Each copy is already fully resolved, so the assembled stack must not go through
    // substitution again.
    this._setResolved('card', stack, forEach.styles, undefined, forEach.chained);
  }

  // The card's own width, which is what decides the column count - not the child's, which
  // is the width the last layout gave it.
  private _watchWidth(): void {
    if (!this._widths) this._widths = new ResizeObserver(() => this._layoutForEach());
    this._widths.disconnect();
    this._widths.observe(this);
  }

  /*
   * The space between repeated copies. Home Assistant's grid and stack cards both read it
   * from a custom property - `--grid-card-gap` and `--stack-card-gap` - and custom
   * properties cross into a shadow root where a rule of our own could never reach.
   */
  protected _applyGap(gap: number | undefined): void {
    const value = Number(gap);
    if (Number.isFinite(value) && value >= 0) {
      this.style.setProperty('--grid-card-gap', `${value}px`);
      this.style.setProperty('--stack-card-gap', `${value}px`);
    } else {
      this.style.removeProperty('--grid-card-gap');
      this.style.removeProperty('--stack-card-gap');
    }
  }

  private _setThing(thing: LovelaceThing, style?: Record<string, string>): void {
    this._savedStyles?.forEach((v, k) => this.style.setProperty(k, v[0], v[1]));
    this._savedStyles = undefined;

    if (style) {
      this._savedStyles = new Map();
      Object.keys(style).forEach((prop) => {
        this._savedStyles?.set(prop, [this.style.getPropertyValue(prop), this.style.getPropertyPriority(prop)]);
        this.style.setProperty(prop, style[prop]);
      });
    }

    this._thing = thing;
    this._forwardGridApi(thing);
    if (this._hass) thing.hass = this._hass;
    this._watchForHiding(thing);
    this._announceSize();
  }

  /*
   * The wrapped card is created asynchronously, so a sections view may already have asked
   * this card for its size and been given nothing - and it only asks again when told.
   * Without this, a card that lost the race was laid out full width until the next edit.
   * Told a frame later, and tried again on connect: said while the card is still detached,
   * or before the section has finished setting up, nobody hears it.
   *
   * Once per wrapped card, and only inside a section. A masonry view answers the same event
   * by rebuilding its columns, which reconnects every card in them - told on each connect,
   * the cards and the view would go on prompting each other for ever.
   */
  private _announceSize(): void {
    const thing = this._thing;
    if (this._thingType !== 'card' || !thing || this._sizeAnnounced === thing) return;
    requestAnimationFrame(() => {
      if (!this.isConnected || this._thing !== thing || this._sizeAnnounced === thing || !sectionOf(this)) return;
      this._sizeAnnounced = thing;
      this.dispatchEvent(new Event('card-updated', { bubbles: true, composed: true }));
    });
  }

  // The wrapped card is watched so that this wrapper can collapse when the card hides
  // itself. Whatever was being watched before is dropped first: a card that has been
  // replaced is no longer anything to react to.
  private _watchForHiding(thing: LovelaceThing): void {
    if (!this._resizes) {
      this._resizes = new ResizeObserver(() => {
        this._displayHidden();
      });
    }
    this._resizes.disconnect();
    this._resizes.observe(thing);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    // Home Assistant moves cards between views rather than rebuilding them, so a card
    // put back on the page has to start watching again.
    if (this._thing) this._watchForHiding(this._thing);
    if (this._forEach?.minWidth) this._watchWidth();
    this._announceSize();
    this._syncSection();
    this._syncBadgeRow();
    this._syncWrapperPreview();
    requestAnimationFrame(() => {
      if (this.isConnected) this._syncWrapperPreview();
    });
  }

  /** Whether this element is a badge in a view's row of badges, which only being on the page can tell. */
  protected get _inBadgeRow(): boolean {
    return this.parentElement?.localName === 'hui-badge';
  }

  /*
   * setConfig runs before the card is on the page, so a group template is first built as a
   * card. One that turns out to be in the row of badges builds again here as badges, before
   * it is first painted.
   */
  private _syncBadgeRow(): void {
    if (this._thingType !== 'card' || this._thingConfig?.type !== GROUP_CARD_TYPE || !this._inBadgeRow) return;
    try {
      this._rebuild();
    } catch (err) {
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  /*
   * setConfig runs before the card is on the page, so it builds without the section's
   * values; a card that turns out to sit in a section with decluttering_defaults or a
   * decluttering_let builds again here, which is before it is first painted. Read on every
   * connect, as dragging a card to another section in edit mode moves it rather than
   * rebuilding it.
   */
  private _syncSection(): void {
    const found = sectionOf(this);
    const before = this._section;
    const quiet = this._builtQuietly;
    if (found?.view === before?.view && found?.section === before?.section && !quiet) return;
    this._section = found;
    const ll = getLovelaceConfig();
    if (!quiet && !hasSectionDefaults(ll, before) && !hasSectionDefaults(ll, found)) return;
    try {
      this._rebuild();
    } catch (err) {
      // Outside setConfig nobody catches a throw, so the card says it itself.
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._resizes?.disconnect();
    this._widths?.disconnect();
  }

  /*
   * The sections layout asks the card how much of the grid it wants, while it renders.
   * Without this the wrapper answers for itself and every templated card is laid out with
   * the defaults instead of the size the wrapped card asked for.
   *
   * Home Assistant ignores `getLayoutOptions` entirely on an element that also has
   * `getGridOptions`, so these are assigned per instance rather than declared on the class:
   * a card implementing only the older API would otherwise be silently ignored.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _forwardGridApi(thing?: any): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any;
    delete self.getGridOptions;
    delete self.getLayoutOptions;
    if (this._thingType !== 'card' || !thing) return;

    /*
     * A template that knows what size it wants says so once, rather than every card using
     * it repeating the same grid_options. What the card itself sets still wins, since that
     * is the more particular of the two, and both win over whatever the wrapped card would
     * have asked for on its own.
     */
    if (this._gridOptions !== undefined) {
      self.getGridOptions = (): unknown => this._gridOptions;
      if (typeof thing.getLayoutOptions === 'function') {
        self.getLayoutOptions = (): unknown => thing.getLayoutOptions();
      }
      return;
    }
    if (typeof thing.getGridOptions === 'function') {
      self.getGridOptions = (): unknown => thing.getGridOptions();
    }
    if (typeof thing.getLayoutOptions === 'function') {
      self.getLayoutOptions = (): unknown => thing.getLayoutOptions();
    }
  }

  protected render(): TemplateResult | void {
    if (this._error) {
      return html` <ha-alert alert-type="error">${this._error}</ha-alert> ${this._renderReport()} `;
    }

    /*
     * What the card actually built, on the dashboard rather than only in the editor. The
     * editor's Result view answers the same question, but not when the card only misbehaves
     * on a phone, or in a view whose editor is awkward to reach.
     */
    if (this._debug && this._thingConfig) {
      return html`
        <ha-card>
          <div class="debug">
            <p>
              ${
                this._templateName
                  ? localize('card.debug_builds_from', { template: this._templateName }, this._hass)
                  : localize('card.debug_builds', undefined, this._hass)
              }
            </p>
            <pre>
${this._debug === 'yaml' ? toYaml(withoutStamps(this._thingConfig)) : JSON.stringify(withoutStamps(this._thingConfig), null, 2)}</pre>
          </div>
        </ha-card>
      `;
    }

    if (this._hiddenByFallback || !this._hass || !this._thing) return html``;

    this.classList.toggle('decluttering-badge', this._thingType === 'badge');
    this.classList.toggle('decluttering-container', this._thingType !== 'badge');
    this.classList.toggle('decluttering-card', this._thingType === 'card');
    // Only a card is laid out as a box in the first place, so only a card has one to give
    // up. A badge is already out of the way, and an element is positioned inside the card.
    this.classList.toggle('decluttering-fit-contents', this._thingType === 'card' && this._fitContents);
    this.classList.toggle('decluttering-report', this._reportMode);

    return html`
      ${
        this._style
          ? html`
              <style>
                ${this._style}
              </style>
            `
          : ''
      }
      ${this._thing} ${this._renderReport()}
    `;
  }

  private static async _createThing(
    thingConfig: LovelaceThingConfig,
    thingType: LovelaceThingType,
    handler: (thing: LovelaceThing) => void,
  ): Promise<void> {
    let thing: LovelaceThing;

    /*
     * Cards go through Home Assistant's own hui-card wrapper, which is what its stack
     * cards use. Creating the element directly, as this card used to, skips everything
     * hui-card does around it: `visibility` conditions were silently ignored inside a
     * template (upstream #85, j9brown #2), grid options were not reported, and rebuilds
     * were handled by hand.
     *
     * hui-card renders into the light DOM, so a style injected into this element's shadow
     * root still reaches the card inside it. It is internal Home Assistant API though, so
     * if it is ever absent the original path still runs.
     */
    let wrapper: CustomElementConstructor | undefined;
    if (thingType === 'card' && thingConfig.type !== 'divider') wrapper = customElements.get('hui-card');
    else if (thingType === 'badge') wrapper = customElements.get('hui-badge');
    if (wrapper) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wrapped = new wrapper() as any;
      wrapped.config = thingConfig;
      handler(wrapped as LovelaceThing);
      return;
    }

    if (HELPERS) {
      if (thingType === 'card') {
        if (thingConfig.type === 'divider') thing = (await HELPERS).createRowElement(thingConfig);
        else thing = (await HELPERS).createCardElement(thingConfig);
      } else if (thingType === 'row') {
        thing = (await HELPERS).createRowElement(thingConfig);
      } else if (thingType === 'element') {
        thing = (await HELPERS).createHuiElement(thingConfig);
      } else if (thingType === 'badge') {
        thing = (await HELPERS).createBadgeElement(thingConfig);
      } else {
        throw new Error(localize('error.unsupported_thing_type', { kind: thingType }));
      }
    } else {
      thing = createThing(thingConfig, thingType === 'row');
    }
    thing.addEventListener(
      'll-rebuild',
      (ev) => {
        ev.stopPropagation();
        DeclutteringElement._createThing(thingConfig, thingType, (newThing: LovelaceThing) => {
          thing.replaceWith(newThing);
          handler(newThing);
        });
      },
      { once: true },
    );
    handler(thing);
  }

  // for LovelaceCard
  public getCardSize(): Promise<number> | number {
    return this._thing && this._thingType === 'card' ? (this._thing as LovelaceCard).getCardSize() : 1;
  }
}

class DeclutteringCard extends DeclutteringElement {
  private _pendingConfig?: DeclutteringCardConfig;
  private _lastConfig?: DeclutteringCardConfig;
  // A card repeating over the registry, kept so it can be worked out again when what is
  // registered changes - a lamp added to the kitchen should appear without an edit.
  private _fromRegistry?: { templateConfig: TemplateConfig; config: DeclutteringCardConfig; picker?: TemplatePicker };
  private _registry?: unknown[];

  // The same pair again, for a template that reads the registry through a resolver rather
  // than repeating over it.
  private _fromResolvers?: {
    templateConfig: TemplateConfig;
    config: DeclutteringCardConfig;
    translates?: boolean;
    picker?: TemplatePicker;
  };
  private _resolverRegistry?: unknown[];
  // Stops this card hearing that the category registry was fetched again - see categories.ts.
  private _categoriesStop?: () => void;

  /*
   * What a `for_each_from: { template: }` rendered to, kept for as long as the card has
   * the same config - hass arrives several times a second and must never ask again. A new
   * config (an edit) starts afresh, so editing the template renders it again.
   */
  private _rendered: Record<string, TemplateRender> = {};
  private _renderedFor?: unknown;
  private _rendering = new Set<string>();
  private _misplacedWarnedFor?: DeclutteringCardConfig;
  // `rebuild_on:` - the states the card was last built with, the ones last seen, and the
  // rebuild waiting out a burst of changes.
  private _rebuildBuilt?: (string | undefined)[];
  private _rebuildSeen?: (string | undefined)[];
  private _rebuildTimer?: ReturnType<typeof setTimeout>;
  private _rebuildWarnedFor?: unknown;

  // What `on_error:` is filled in from: the card's own variables, and its template once found.
  private _fallbackSource?: { variables?: VariablesConfig[]; template?: TemplateConfig; name?: string };
  // The error `on_error:` is standing in for, while it is, and the config built for it.
  private _fallbackFor?: string;
  private _fallbackConfig?: LovelaceThingConfig;
  private _buildingFallback = false;
  // Set when `on_error:` itself could not be shown, which leaves the error showing instead of looping.
  private _fallbackFailed = false;

  /*
   * Asks the hui-card or hui-badge around this card to leave it on the page while it is
   * hidden. They would otherwise take it off, and a card that is off the page stops
   * watching the card inside it, so it would never notice that card coming back.
   */
  public connectedWhileHidden = true;

  public connectedCallback(): void {
    super.connectedCallback();
    // Home Assistant takes cards off the page and puts them back while it lays a view out,
    // which stops the card hearing about categories (below); put back, it starts again.
    if (this._hass && this._fromRegistry) this._loadLabelsIfWanted(this._hass);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._categoriesStop?.();
    this._categoriesStop = undefined;
  }

  constructor() {
    super();
    // The hui-card inside says when its visibility conditions change. Heard here, on the
    // way out, so this card is hidden or shown before the wrapper around it checks.
    const heard = (ev: Event) => {
      if (ev.composedPath()[0] !== this) this._displayHidden();
    };
    this.addEventListener('card-visibility-changed', heard);
    this.addEventListener('badge-visibility-changed', heard);
  }

  /*
   * Collapsing this element is not enough in a sections view. The section gives every card
   * a grid cell and only frees it when the card has the hidden attribute, and hides a
   * whole section only once every card in it does - so a template card that hid itself
   * left an empty cell behind, and a section of nothing else stayed on the page and pushed
   * the others off centre (#152). The wrapper around this card only looks again when it
   * is told, so it is told.
   */
  protected _displayHidden(): void {
    super._displayHidden();
    if (this._thingType !== 'card' && this._thingType !== 'badge') return;
    const hidden = this.classList.contains('child-card-hidden');
    if (this.hasAttribute('hidden') === hidden) return;
    this.toggleAttribute('hidden', hidden);
    const event = this._thingType === 'badge' ? 'badge-visibility-changed' : 'card-visibility-changed';
    this.dispatchEvent(new Event(event, { bubbles: true, composed: true }));
  }

  /*
   * Home Assistant can say a card is a preview after it has been configured, and a lazy
   * repeat built before then left copies waiting in an editor preview, which never scrolls
   * them into view. Told, it builds again with every copy.
   */
  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('preview') && this.preview && this._lazyShown) {
      try {
        this._rebuild();
      } catch (err) {
        this._error = (err as Error)?.message ?? String(err);
      }
    }
  }

  static getConfigElement(): HTMLElement {
    return document.createElement(CARD_EDITOR_TAG);
  }

  static getStubConfig(): DeclutteringCardConfig {
    return {
      type: `custom:${CARD_TAG}`,
      template: 'follow_the_sun',
    };
  }

  /*
   * Building can fail in setConfig - a template that is not there, one defining two things,
   * a repeat of a badge - and Home Assistant answers a throw there by swapping the card for
   * its own error card. A card with `on_error:` says it instead, so it can show that.
   */
  public setConfig(config: DeclutteringCardConfig): void {
    this._lastConfig = config;
    this._fallbackFor = undefined;
    this._fallbackConfig = undefined;
    this._fallbackFailed = false;
    this._fallbackSource = { variables: withInheritedVariables(config).variables, name: config.template };
    if (this._hiddenByFallback) {
      this._hiddenByFallback = false;
      this._displayHidden();
    }
    try {
      this._configure(config);
    } catch (err) {
      if (!this._onError()) throw err;
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  private _configure(config: DeclutteringCardConfig): void {
    if (!config.template && !byDomainOf(config)) {
      throw new Error(localize('error.missing_template'));
    }

    /*
     * What is already being drawn above this card. A template that uses itself, directly
     * or through another template, would otherwise build the next level forever - each one
     * while it is still detached from the page, so nothing in the layout ever gets the
     * chance to stop it and the tab simply stops responding.
     */
    this._openTemplates = chainOf(config);
    this._templateName = config.template;
    // Whatever the card around it handed down, read from here on as if written on this card.
    this._handedDown = handedDownNames(config);
    config = withInheritedVariables(config);

    // Said here rather than thrown: Home Assistant collapses a card that throws in
    // setConfig to "Configuration error" with the reason hidden, and the reason - which
    // templates loop, and in what order - is the whole of what makes this fixable.
    const cycle = findCycle(this._openTemplates, config.template);
    const tooDeep = this._openTemplates.length >= MAX_NESTING;
    if (cycle || tooDeep) {
      this._error = cycle ? describeCycle(cycle) : describeTooDeep(this._openTemplates);
      return;
    }

    const ll = getLovelaceConfig();
    if (!ll) {
      throw new Error(localize('error.no_lovelace'));
    }
    this._error = undefined;
    this._rebuildOn = rebuildOnEntities(config.rebuild_on);
    this._warnRebuildOn(config);
    /*
     * Anything but `contents` leaves the card with a box of its own, which is what it has
     * always had - so a value nobody recognises falls back to the way it worked before
     * rather than to a layout they did not ask for.
     */
    this._fitContents = config.fit === 'contents';
    const place = this._place(ll);
    if (byDomainOf(config)) {
      this._chooseByDomain(ll, config, place);
      return;
    }
    const templateConfig = findTemplate(ll, config.template, place.view, place.section);
    /*
     * setConfig runs before hass is ever set, and a card that reads states has none to read
     * yet - built now, every `|state` would be left in brackets and complained about, only
     * to be built again a moment later. It waits for hass instead, the way a borrowed
     * template does.
     */
    if (templateConfig && this._rebuildOn.length && !this._hass) {
      this._pendingConfig = config;
      return;
    }
    if (templateConfig) {
      this._pendingConfig = undefined;
      this._applyTemplate(templateConfig, config);
      return;
    }
    if (!mayBorrowTemplates(ll)) {
      throw new Error(
        localize('error.template_missing', { template: config.template }, this._hass) +
          didYouMean(config.template, Object.keys(collectTemplates(ll))),
      );
    }
    // The template may live on a dashboard this one borrows from, or on the library
    // dashboard every one borrows from, which has to be fetched.
    // setConfig cannot wait, so it is picked up as soon as hass arrives.
    this._pendingConfig = config;
    if (this._hass) this.hassAvailable(this._hass);
  }

  protected _rebuild(): void {
    if (this._lastConfig) this.setConfig(this._lastConfig);
  }

  /* ------------------------------------------------------------ on_error */

  // The card's `on_error:`, or its template's - looked up here when the build failed first.
  private _onError(): OnError | undefined {
    let template = this._fallbackSource?.template;
    const name = this._fallbackSource?.name;
    if (!template && name) {
      try {
        template = findTemplate(getLovelaceConfig(), name) ?? undefined;
      } catch {
        template = undefined;
      }
    }
    return onErrorOf(this._lastConfig, template);
  }

  /*
   * Whatever set the error - setConfig, a strict refusal, a template still missing once
   * the other dashboards were read, a registry repeat - it all ends here, so `on_error:`
   * only has to be looked for in one place.
   */
  protected willUpdate(changed: PropertyValues): void {
    super.willUpdate(changed);
    if (changed.has('_error') && this._error && !this._fallbackFailed) this._showFallback(this._error);
  }

  /*
   * What a card shows instead of an error. Of the kind its template builds, or - with no
   * template to say - a badge in a row of badges and a card anywhere else. Filled in with
   * the card's variables, and the template's defaults when there is a template.
   */
  private _showFallback(message: string): void {
    const onError = this._onError();
    if (!onError) return;
    this._fallbackFor = message;
    console.warn(localize('warn.on_error', { message }, this._hass));
    this._error = undefined;
    this._stopRepeat();
    const template = this._fallbackSource?.template;
    const kind: LovelaceThingType = this._inBadgeRow
      ? 'badge'
      : ((template ? getThingType(template) : undefined) ?? this._thingType ?? 'card');
    if ('hide' in onError) {
      this._thingType = kind;
      this._hiddenByFallback = true;
      this._displayHidden();
      return;
    }
    try {
      const built = deepReplace(
        this._fallbackSource?.variables,
        template ?? ({} as TemplateConfig),
        onError.config,
        this._fallbackSource?.name,
        this._hass,
        true,
      );
      this._buildingFallback = true;
      this._setResolved(kind, built, '');
    } catch {
      // An on_error that cannot be built itself shows the error it stood in for.
      this._fallbackFailed = true;
      this._error = message;
    } finally {
      this._buildingFallback = false;
    }
  }

  protected _afterResolved(config: LovelaceThingConfig): void {
    if (this._buildingFallback) this._fallbackConfig = config;
    else {
      // A card that builds after all is no longer standing in for anything.
      this._fallbackFor = undefined;
      this._fallbackConfig = undefined;
      this._fallbackFailed = false;
      if (this._hiddenByFallback) {
        this._hiddenByFallback = false;
        this._displayHidden();
      }
    }
    if (this._onError()) void this._checkDefined(config);
  }

  /*
   * A card that builds a custom card nobody installed is the one failure Home Assistant
   * reports rather than this card - by drawing its own error where the card should be. With
   * `on_error:` set it is caught here instead, after the same short wait Home Assistant
   * gives a resource still loading. If the element does turn up later, the card builds again.
   */
  private async _checkDefined(config: LovelaceThingConfig): Promise<void> {
    const tags = customTags(config);
    if (!tags.length) return;
    const missing = await undefinedElements(tags);
    if (!missing.length || this._thingConfig !== config) return;
    const message = localize(
      'error.custom_element_missing',
      { types: missing.map((tag) => `custom:${tag}`).join(', ') },
      this._hass,
    );
    if (config === this._fallbackConfig) {
      this._fallbackFailed = true;
      this._error = this._fallbackFor ?? message;
    } else {
      this._error = message;
    }
    const waitingOn = this._lastConfig;
    void Promise.all(missing.map((tag) => customElements.whenDefined(tag))).then(() => {
      if (this._lastConfig === waitingOn) this._rebuild();
    });
  }

  /*
   * A card choosing its template by domain needs every template it names to hand before it
   * can build anything, since which one a copy gets depends on that copy. When this
   * dashboard has them all - or cannot borrow any - it builds now; otherwise it waits for
   * hass, the same way a card whose one template lives on another dashboard does.
   */
  private _chooseByDomain(
    ll: LovelaceConfig,
    config: DeclutteringCardConfig,
    place: { view?: number; section?: number },
  ): void {
    const local = collectTemplates(ll, place.view, undefined, place.section);
    const named = [config.template, ...Object.values(byDomainOf(config) ?? {})].filter(Boolean) as string[];
    if (named.every((name) => local[name] !== undefined) || !mayBorrowTemplates(ll)) {
      this._pendingConfig = undefined;
      this._applyByDomain(local, config);
      return;
    }
    this._pendingConfig = config;
    if (this._hass) this.hassAvailable(this._hass);
  }

  /*
   * Builds a card choosing by domain from the templates there are. A single card chooses
   * once and is then built exactly as though it had named that template. A repeat keeps the
   * way of choosing, so each copy - and each rebuild - picks its own; the template the card
   * falls back on stands for the whole card where one has to, in its styles, its size and
   * its `empty:`.
   */
  private _applyByDomain(templates: Record<string, TemplateConfig>, config: DeclutteringCardConfig): void {
    const available = Object.keys(templates);
    const lookup = (name: string | undefined): TemplateConfig | undefined =>
      name !== undefined && Object.prototype.hasOwnProperty.call(templates, name) ? templates[name] : undefined;
    const byDomain = byDomainOf(config) ?? {};
    const named = [config.template, ...Object.values(byDomain)].filter(Boolean) as string[];
    const picker: TemplatePicker = {
      pick: (variables) => {
        const picked = pickTemplate(config, variables, lookup, this._hass, available);
        // The chain of open templates has to see the one actually chosen, or a template
        // reaching itself through a by-domain card would build levels for ever.
        const cycle = findCycle(this._openTemplates, picked.name);
        if (cycle) throw new Error(describeCycle(cycle));
        warnIfDeprecated(picked.name, picked.template, this._hass);
        return picked;
      },
      resolvers: named.some((name) => usesResolver(lookup(name))),
    };

    const repeats = forEachItems(config.for_each) !== undefined || isRegistrySource(config.for_each_from);
    if (!repeats) {
      const { name, template, entity } = picker.pick(config.variables);
      this._templateName = name;
      this._applyTemplate(template, {
        ...config,
        template: name,
        variables: withPickedEntity(config.variables, entity) as VariablesConfig[] | undefined,
      });
      return;
    }
    const fallback = Object.prototype.hasOwnProperty.call(byDomain, 'default') ? byDomain.default : config.template;
    const base = lookup(fallback) ?? lookup(named.find((name) => lookup(name))) ?? ({} as TemplateConfig);
    this._applyTemplate(base, config, picker);
  }

  // A card renders its template once, or once per item when it is given a list to repeat
  // over. An empty list is not an error - it is a list that happens to have nothing in it
  // today - so it simply renders nothing rather than failing the card.
  private _applyTemplate(
    templateConfig: TemplateConfig,
    config: DeclutteringCardConfig,
    picker?: TemplatePicker,
  ): void {
    this._fallbackSource = { variables: config.variables, template: templateConfig, name: config.template };
    this._fromRegistry = undefined;
    this._registry = undefined;
    // Compared on the config as it was given: what reaches here is rebuilt from it on
    // every setConfig, and a rebuild with the same config (a section move) is not an edit.
    const given = this._lastConfig ?? config;
    if (this._renderedFor !== given) {
      this._renderedFor = given;
      this._rendered = {};
      this._rendering.clear();
    }
    // The states this build reads, so only a change from these sets off the next one.
    this._rebuildBuilt = this._rebuildOn.length ? stateSnapshot(this._hass, this._rebuildOn) : undefined;
    this._rebuildSeen = this._rebuildBuilt;
    this._applyGap(config.gap);
    this._strict = config.strict === true;
    this._debug = config.debug === 'yaml' ? 'yaml' : config.debug === true ? 'json' : false;
    this._trace = wantsTrace(config);
    this._reportMode = config.debug === 'report';
    this._lastReport = undefined;
    if (!this._reportMode) this._reportResult = undefined;
    this._tracePlace = tracePlace(config);
    this._traceRoot = traceRoot(config);
    this._traceLabel = undefined;
    // What the card asks for beats what the template says it wants.
    this._gridOptions = config.grid_options ?? (templateConfig as { grid_options?: unknown }).grid_options;
    this._warnMisplacedOverrides(templateConfig, config);
    // Still built exactly as before: a deprecated template is a note to whoever keeps the
    // dashboard, said once in the console and listed in the health panel. Choosing by
    // domain, it is said of the templates the copies actually get.
    if (!picker) warnIfDeprecated(config.template, templateConfig, this._hass);

    /*
     * A resolver reads the registry, and the registry can arrive after the card has first
     * rendered - so remember what to build if it changes under us. Recorded before the
     * branching, not after: a template using `[[entity|friendly_name]]` needs building
     * again whether it is rendered once or repeated, and recording it only on the plain
     * path left every copy of a repeat showing the brackets for good.
     */
    const resolvers = picker ? picker.resolvers : usesResolver(templateConfig);
    this._fromResolvers = resolvers
      ? { templateConfig, config, picker, translates: usesTranslate(templateConfig) }
      : undefined;

    // A single mapping counts as a list of one, the same forgiveness `variables` gets. A
    // written-out list wins over a registry source: it is the more particular of the two,
    // and having both silently pick one would be worse than having it say which.
    const items = forEachItems(config.for_each);
    if (items) {
      this._setForEach(templateConfig, config, items, picker);
      return;
    }
    if (isRegistrySource(config.for_each_from)) {
      // It works itself out again on a registry change already, which covers its resolvers.
      this._fromResolvers = undefined;
      this._fromRegistry = { templateConfig, config, picker };
      // setConfig runs before hass is ever set, so the first resolution usually waits.
      if (this._hass) this._resolveFromRegistry(this._hass);
      return;
    }
    this._setTemplateConfig(templateConfig, config.variables, config.style, config.template, config);
  }

  /*
   * A `card:` block on a card whose template builds a badge is never read, which looks
   * exactly like the override not working. Said once per config rather than refused: the
   * template may be switched to the matching kind in a moment.
   */
  private _warnMisplacedOverrides(templateConfig: TemplateConfig, config: DeclutteringCardConfig): void {
    if (this._misplacedWarnedFor === config) return;
    this._misplacedWarnedFor = config;
    const kind = getThingType(templateConfig);
    for (const key of misplacedOverrides(config, kind)) {
      console.warn(
        localize('warn.override_misplaced', { key, kind: kind as string, template: config.template }, this._hass),
      );
    }
  }

  /*
   * A template whose placeholders ask Home Assistant for something is built again when the
   * registry changes, so a name that was not known yet at first render turns up rather
   * than leaving the placeholder on the card for good. Guarded the same way the registry
   * source is: hass is replaced on every state change, the registry is not.
   */
  private _rebuildForResolvers(hass: HomeAssistant): void {
    const pending = this._fromResolvers;
    if (!pending) return;

    // `|translate` reads hass.localize, which is replaced when more translations load or
    // the language changes - and only then, so it joins the key without costing a rebuild
    // per state change. Only for a template that translates, so nobody else pays for it.
    const key = pending.translates
      ? [...registryKey(hass), (hass as { localize?: unknown })?.localize]
      : registryKey(hass);
    if (sameRegistry(this._resolverRegistry, key)) return;
    this._resolverRegistry = key;

    // Built the same way it was built the first time, so a repeat comes back as a repeat.
    // Outside setConfig nobody catches a throw - and a card with on_error: lives on after
    // one - so the card says it itself.
    try {
      const items = forEachItems(pending.config.for_each);
      if (items) {
        this._setForEach(pending.templateConfig, pending.config, items, pending.picker);
        return;
      }
      this._setTemplateConfig(
        pending.templateConfig,
        pending.config.variables,
        pending.config.style,
        pending.config.template,
        pending.config,
      );
    } catch (err) {
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  /*
   * The copies a registry source asks for. hass arrives on every state change, so the work
   * is skipped unless the registry itself has moved - otherwise a dashboard of these would
   * rebuild itself several times a second.
   */
  private _resolveFromRegistry(hass: HomeAssistant): void {
    const source = this._fromRegistry;
    if (!source) return;

    // A repeat over views reads the dashboard's configuration, which is replaced as a
    // whole when the dashboard is edited - so its views are part of the key too.
    // The rendered templates are swapped for a new object when one lands, so that
    // counts as a change too.
    const context = { ...sourceContext(getLovelaceConfig()), rendered: this._rendered };
    const key = [...registryKey(hass), context.views, context.rendered];
    if (sameRegistry(this._registry, key)) return;

    // A template source builds nothing until its template has rendered - building with no
    // copies first would flash the `empty:` card at everyone on every page load.
    const template = sourceTemplate(source.config.for_each_from);
    if (template !== undefined && !Object.prototype.hasOwnProperty.call(this._rendered, template)) {
      this._renderSourceTemplate(hass, template);
      return;
    }
    this._registry = key;

    try {
      const items = resolveRegistryItems(hass, source.config.for_each_from, context);
      this._setForEach(source.templateConfig, source.config, items, source.picker);
      this._error = undefined;
    } catch (err) {
      // Thrown from outside setConfig, where Home Assistant would catch it, so the card
      // has to report it itself rather than leaving the old copies on screen.
      this._error = (err as Error)?.message ?? String(err);
    }
  }

  /*
   * Renders a source's template once (see template-source.ts for why only once), keeps the
   * answer, and builds. A render that failed, or that is not a list, is said in the
   * console and builds no copies - the `empty:` card, if there is one.
   */
  private _renderSourceTemplate(hass: HomeAssistant, template: string): void {
    if (this._rendering.has(template)) return;
    this._rendering.add(template);
    const owner = this._renderedFor;
    void renderTemplateOnce(hass, template).then((render) => {
      // Answered for a config the card no longer has: the new one renders for itself.
      if (this._renderedFor !== owner) return;
      this._rendering.delete(template);
      this._rendered = { ...this._rendered, [template]: render };
      warnUnlisted(template, render, this._hass ?? hass);
      this._resolveFromRegistry(this._hass ?? hass);
    });
  }

  /*
   * Home Assistant does not carry the label registry on hass, so a card that shows labels
   * fetches it (once per page, in labels.ts) and rebuilds when it lands - the registry key
   * includes it, so the ids on screen turn into names without waiting for a state change.
   * Only cards that mention labels at all ask, so nobody else pays for the call.
   */
  private _loadLabelsIfWanted(hass: HomeAssistant): void {
    const using = [this._fromRegistry, this._fromResolvers].filter(Boolean);
    const labels = using.some((source) => /label/i.test(JSON.stringify(source)));
    // Categories the same way, for a repeat narrowing by one - see categories.ts.
    const categories = !!this._fromRegistry && wantsCategories(this._fromRegistry.config.for_each_from);
    if (!labels && !categories) return;
    // Renaming or filing into a category changes nothing on hass, so nothing else would
    // rebuild the card when the registry is fetched again. The registry key moves with it.
    if (categories && !this._categoriesStop) {
      this._categoriesStop = whenCategoriesChange(() => {
        if (this._hass) this._resolveFromRegistry(this._hass);
      });
    }
    void Promise.all([labels ? loadLabels(hass) : undefined, categories ? loadCategories(hass) : undefined]).then(
      () => {
        // `hass` is a setter here with no getter, so the latest one is `_hass` - reading
        // `this.hass` gives undefined and the rebuild never happens.
        const latest = this._hass ?? hass;
        this._resolveFromRegistry(latest);
        this._rebuildForResolvers(latest);
      },
    );
  }

  /*
   * Integration names are in Home Assistant's `title` translations, which a dashboard does
   * not necessarily have loaded. A card using `|translate` asks for them once per page;
   * when they land hass.localize is replaced, which rebuilds the card - see above.
   */
  private _loadTranslationsIfWanted(hass: HomeAssistant): void {
    if (!this._fromResolvers?.translates) return;
    void loadTitleTranslations(hass).then(() => this._rebuildForResolvers(this._hass ?? hass));
  }

  /*
   * hass arrives on every state change anywhere in the house, so this compares only the
   * listed entities' states, and only against the last ones seen - a card is not put back
   * on its timer by changes it does not care about, or it would never get to build on a
   * busy system. A burst of changes builds once, a moment after the last of them.
   */
  private _watchRebuildOn(hass: HomeAssistant): void {
    if (!this._rebuildOn.length || !this._lastConfig) return;
    const now = stateSnapshot(hass, this._rebuildOn);
    if (!statesMoved(this._rebuildSeen, now)) return;
    this._rebuildSeen = now;
    if (this._rebuildTimer) clearTimeout(this._rebuildTimer);
    this._rebuildTimer = setTimeout(() => {
      this._rebuildTimer = undefined;
      // Back where it was built: nothing to do.
      if (!statesMoved(this._rebuildBuilt, stateSnapshot(this._hass, this._rebuildOn))) return;
      try {
        this._rebuild();
      } catch (err) {
        // Outside setConfig nobody catches a throw, so the card says it itself.
        this._error = (err as Error)?.message ?? String(err);
      }
    }, REBUILD_DEBOUNCE_MS);
  }

  /*
   * Something in `rebuild_on:` that is not an entity id is never watched, which looks
   * exactly like the card not reacting. Said once per config rather than refused.
   */
  private _warnRebuildOn(config: DeclutteringCardConfig): void {
    // Keyed on the config as given: the one read here can be a fresh copy on every build.
    if (this._rebuildWarnedFor === this._lastConfig) return;
    this._rebuildWarnedFor = this._lastConfig;
    const rejects = rebuildOnRejects(config.rebuild_on);
    if (rejects.length) {
      console.warn(
        localize('warn.rebuild_on_not_entity', { which: rejects.join(', '), template: config.template }, this._hass),
      );
    }
  }

  protected hassAvailable(hass: HomeAssistant): void {
    const config = this._pendingConfig;
    if (!config) {
      this._watchRebuildOn(hass);
      this._resolveFromRegistry(hass);
      this._rebuildForResolvers(hass);
      this._loadLabelsIfWanted(hass);
      this._loadTranslationsIfWanted(hass);
      return;
    }
    this._pendingConfig = undefined;

    const ll = getLovelaceConfig();
    const place = this._place(ll);
    if (byDomainOf(config)) {
      collectAllTemplates(hass, ll, place.view, undefined, place.section)
        .then((all) => {
          // Thrown from outside setConfig, where nobody would catch it, so the card says it.
          try {
            this._applyByDomain(all, config);
            this._loadLabelsIfWanted(hass);
          } catch (err) {
            this._error = (err as Error)?.message ?? String(err);
          }
        })
        .catch((err) => {
          this._error = localize(
            'error.template_resolve_failed',
            { template: config.template ?? BY_DOMAIN_KEY, message: err?.message ?? err },
            hass,
          );
        });
      return;
    }
    findTemplateAnywhere(hass, ll, config.template, place.view, place.section)
      .then((templateConfig) => {
        if (templateConfig) {
          this._applyTemplate(templateConfig, config);
          this._loadLabelsIfWanted(hass);
          this._loadTranslationsIfWanted(hass);
        } else {
          // Only a dashboard that names somewhere to borrow from is told it was looked for there.
          const key = getTemplateSources(ll).length ? 'error.template_missing_anywhere' : 'error.template_missing';
          const missing = localize(key, { template: config.template }, hass);
          this._error = missing;
          // Every name there is, borrowed ones included, is known by the time this runs.
          // Not added once `on_error:` has taken the error's place - it has been said.
          collectAllTemplates(hass, ll).then((all) => {
            if (this._error === missing) this._error = missing + didYouMean(config.template, Object.keys(all));
          });
        }
      })
      .catch((err) => {
        this._error = localize(
          'error.template_resolve_failed',
          { template: config.template, message: err?.message ?? err },
          hass,
        );
      });
  }
}

class DeclutteringCardEditor extends LitElement implements LovelaceCardEditor {
  static get styles(): CSSResult {
    return css`
      .description {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
      }
      .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      ha-expansion-panel {
        margin-top: 16px;
      }
      .risks {
        margin: 4px 0 0;
        padding-left: 18px;
      }
      .result {
        padding: 0 8px 8px;
      }
      .result .hint {
        margin: 8px 0;
      }
      .section-per-copy {
        margin-top: 16px;
      }
      .examples {
        margin-bottom: 8px;
      }
    `;
  }

  @state() private _lovelace?: LovelaceConfig;
  @state() private _config?: DeclutteringCardConfig;

  @property() public hass?: HomeAssistant;

  private _templates?: Record<string, TemplateConfig>;
  // Typed booleans drawn as a switch other than the value written - see _formData.
  private _shownAs = new Map<string, { shown: boolean; written: unknown }>();
  @state() private _loadingTemplates = false;
  @state() private _ejectPending = false;
  @state() private _sectionsPending = false;
  @state() private _sectionsError?: string;
  // What each `for_each_from: { template: }` written in this editor rendered to, so the
  // match preview can show it. Rendered once per distinct template text, like the card.
  @state() private _renderedTemplates: Record<string, TemplateRender> = {};
  private _renderingTemplates = new Set<string>();
  // The card as the dialog opened it, which is what an eject replaces on the dashboard.
  private _openedWith?: DeclutteringCardConfig;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _schema: any;

  set lovelace(lovelace: LovelaceConfig) {
    this._lovelace = lovelace;
    this._templates = undefined;
    this._schema = undefined;
  }

  /*
   * The view and section of the card being edited, whose decluttering_defaults and
   * decluttering_let reach it - without them the Result showed `[[vlet]]` and the editor
   * said a name the view's let gives had no value. Read off the edit dialog; outside one,
   * the view on screen.
   */
  private _editingPlace(): { view?: number; section?: number } {
    const dialog = editDialogOf(this);
    const place = dialog ? dialogPlace(dialog) : undefined;
    return place ?? { view: currentViewIndex(this._lovelace) };
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    // A card-valued variable renders Home Assistant's own card editor and picker, which
    // are lazy-loaded - free after the first editor anywhere has loaded them.
    await loadCardEditorPicker();
  }

  public setConfig(config: DeclutteringCardConfig): void {
    // The first config is the card as the dashboard has it saved; every later one is an edit.
    this._openedWith ??= config;
    this._config = config;
  }

  /*
   * Working out which templates exist, and the form to offer for them, is preparation for
   * a render rather than part of one. It lives here because all of it sets state, and Lit
   * asks that state be settled before render rather than changed during it - doing this in
   * render schedules another update from inside the one in progress.
   */
  protected willUpdate(): void {
    if (!this.hass || !this._config) return;

    // The lovelace property is not set when editing row elements, so it is looked up here.
    if (!this._lovelace) this._lovelace = getLovelaceConfig() ?? undefined;
    if (!this._lovelace) return;

    if (!this._templates) {
      const place = this._editingPlace();
      this._templates = collectTemplates(this._lovelace, place.view, undefined, place.section);
      this._loadBorrowedTemplates();
    }
    if (!this._schema) {
      this._schema = [
        {
          name: 'template',
          label: localize('editor.template_label', undefined, this.hass),
          selector: {
            select: {
              mode: 'dropdown',
              custom_value: true,
              // A name on its own says nothing about what a template is for, and a
              // dashboard with twenty of them becomes a memory test. The description the
              // template already carries is put beside it. Sorted already, with the
              // deprecated ones marked and last, which the select's own sort would undo.
              options: templatePickerOptions(this._templates, this.hass),
            },
          },
        },
        {
          name: 'variables',
          label: localize('editor.variables_label', undefined, this.hass),
          helper: localize('editor.variables_helper', undefined, this.hass),
          selector: { object: {} },
        },
      ];
    }
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config || !this._templates || !this._schema) return html``;

    const template = this._templates[this._config.template];
    const declarations = getDeclarations(template);
    const readable = isVariablesShape(this._config.variables);
    // The same gate _setForEach applies, so the editor never offers a repeat the card
    // would refuse to render - except while a for_each is set, which must stay visible
    // whatever the template looks like, or it could never be removed from the form.
    const byDomain = byDomainOf(this._config);
    const repeatable =
      (!!template && getThingType(template) === 'card') ||
      !!byDomain ||
      this._config.for_each !== undefined ||
      this._config.for_each_from !== undefined;

    const error: Record<string, string | string[]> = {};
    // Templates borrowed from another dashboard are still on their way, so do not accuse
    // the user of a bad name until they have arrived.
    // A card choosing by domain may have no template: of its own at all.
    if (!template && !this._loadingTemplates && !(byDomain && !this._config.template)) {
      error.template = localize('editor.no_such_template', undefined, this.hass);
    }
    if (!readable) {
      error.variables = localize('error.variables_shape', undefined, this.hass);
    }

    const retired = deprecationOf(template);
    return html`
      ${template?.description ? html`<p class="description">${template.description}</p>` : html``}
      ${
        /*
         * The form has no way to edit a mapping of domains to templates, but it does not
         * need one to leave it alone: every save carries the rest of the config through,
         * and the mapping is changed in the code editor.
         */
        byDomain
          ? html`<ha-alert alert-type="info">
              ${localize(
                'editor.by_domain_hint',
                {
                  templates: Object.entries(byDomain)
                    .map(([domain, name]) => `${domain}: ${name}`)
                    .join(', '),
                },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${
        retired === undefined
          ? html``
          : html`<ha-alert alert-type="warning">
              ${
                retired
                  ? localize('editor.template_deprecated_because', { message: retired }, this.hass)
                  : localize('editor.template_deprecated', undefined, this.hass)
              }
            </ha-alert>`
      }
      ${this._renderSource(template)} ${this._renderStartFromExample(template)}
      ${this._renderDiagnostics(template, readable)} ${this._renderMatches()}
      <ha-form
        .hass=${this.hass}
        .data=${this._formData(declarations)}
        .schema=${this._formSchema(declarations, repeatable)}
        .error=${error}
        .computeLabel=${(s): string => s.label ?? s.name}
        .computeHelper=${(s): string => s.helper ?? ''}
        @value-changed=${this._valueChanged}
      ></ha-form>
      ${this._renderCardVariables(declarations)} ${this._renderResult(template)} ${this._renderSectionPerCopy()}
    `;
  }

  /*
   * A template with examples can fill a new card in from one of them, which is quicker
   * than reading the declarations and typing each value - and shows straight away what a
   * working set looks like. Only for a card that sets nothing yet: an example is a place
   * to start, not something to lay over values somebody has already chosen.
   */
  private _renderStartFromExample(template: TemplateConfig | undefined): TemplateResult {
    const sets = exampleSets(template);
    if (!sets.length || !this._config || ownVariables(this._config.variables).length) return html``;
    return html`
      <div class="examples">
        <p class="hint">${localize('editor.start_from_example_hint', undefined, this.hass)}</p>
        ${sets.map(
          (set, index) => html`
            <ha-button @click=${(): void => this._startFromExample(set)}>
              ${localize('editor.start_from_example', { number: index + 1 }, this.hass)}
            </ha-button>
          `,
        )}
      </div>
    `;
  }

  private _startFromExample(variables: VariablesConfig[]): void {
    if (!variables.length) return;
    fireEvent(this, 'config-changed', { config: { ...this._config, variables } as DeclutteringCardConfig });
  }

  /*
   * A variable declared `selector: {card: {}}` takes a whole card as its value, so its
   * control is Home Assistant's own card editor rather than a box of YAML. Substitution
   * has always injected a mapping whole; this is the editor catching up with it.
   */
  private _renderCardVariables(declarations: VariableDeclaration[]): TemplateResult {
    const slots = declarations.filter((declaration) => isCardDeclaration(declaration));
    if (!slots.length) return html``;
    const values = variableValues(this._config?.variables);
    return html`${slots.map((declaration) => {
      const value = values[declaration.name];
      const filled = !!value && typeof value === 'object';
      return html`
        <div class="card-variable">
          <h3>${declaration.label ?? declaration.name}</h3>
          ${declaration.description ? html`<p class="hint">${declaration.description}</p>` : html``}
          ${
            filled
              ? html`
                  <hui-card-element-editor
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    .value=${value}
                    @config-changed=${(ev: CustomEvent): void => this._cardVariableChanged(declaration.name, ev)}
                  ></hui-card-element-editor>
                  <ha-button @click=${(): void => this._cardVariableChanged(declaration.name)}>
                    ${localize('editor.card_variable_clear', undefined, this.hass)}
                  </ha-button>
                `
              : html`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this._lovelace}
                    @config-changed=${(ev: CustomEvent): void => this._cardVariableChanged(declaration.name, ev)}
                  ></hui-card-picker>
                `
          }
        </div>
      `;
    })}`;
  }

  private _cardVariableChanged(name: string, ev?: CustomEvent): void {
    ev?.stopPropagation();
    const value = ev?.detail?.config;
    const variables = ownVariables(this._config?.variables).filter((entry) => variableName(entry) !== name);
    if (value && typeof value === 'object') variables.push({ [name]: value });
    const config = { ...this._config } as DeclutteringCardConfig;
    if (variables.length) config.variables = variables;
    else delete config.variables;
    fireEvent(this, 'config-changed', { config });
  }

  /*
   * What the card is actually built from, once every variable has been put in. The
   * template and the values are in two different places on the dashboard and the card
   * renders a third thing, so working out why the result is not what you meant has always
   * meant reading both and doing the substitution in your head. This does it for you.
   */
  private _renderResult(named: TemplateConfig | undefined): TemplateResult {
    if (!this._config) return html``;
    // for_each renders the same template once per item, so one copy stands for all of
    // them - showing every copy would bury the thing you opened this to look at.
    const items = forEachItems(this._config.for_each);
    let variables = items?.length
      ? forEachVariables(items[0], this._config.variables, 0, items.length)
      : this._config.variables;
    // Choosing by domain, that copy is built from the template its own entity picks.
    let template = named;
    let templateName = this._config.template;
    if (byDomainOf(this._config)) {
      try {
        const templates = this._templates ?? {};
        let entity: string | undefined;
        ({
          template,
          name: templateName,
          entity,
        } = pickTemplate(this._config, variables, (name) => templates[name], this.hass, Object.keys(templates)));
        variables = withPickedEntity(variables, entity) as VariablesConfig[] | undefined;
      } catch {
        return html``;
      }
    }
    if (!template) return html``;
    const thingType = getThingType(template);
    if (!thingType) return html``;

    const content = thingContent(template);

    let resolved: unknown;
    try {
      // Quietly: the editor re-renders on every keystroke, and the card itself already
      // says what it could not resolve when it renders for real.
      // A state the card rebuilds on is read as it stands now, as the card itself would.
      const scoped = withStateScope(this.hass, rebuildOnEntities(this._config.rebuild_on));
      resolved = applyOverride(
        deepReplace(variables, template, content, templateName, scoped, true),
        this._config,
        thingType,
      );
    } catch (err) {
      return html`<ha-alert alert-type="warning">
        ${localize('editor.result_error', { error: String(err) }, this.hass)}
      </ha-alert>`;
    }

    const copies = items?.length ? localize('editor.result_copies', { total: items.length }, this.hass) : '';
    // Translated whole, then split so the [[name]] in the middle can be set in code.
    const [hintBefore, hintAfter] = splitAt(localize('editor.result_hint', { kind: thingType }, this.hass), '[[name]]');

    return html`
      <ha-expansion-panel outlined>
        <span slot="header">${localize('editor.result_header', undefined, this.hass)}${copies}</span>
        <div class="result">
          <p class="hint">${hintBefore}<code>[[name]]</code>${hintAfter}</p>
          <ha-yaml-editor .hass=${this.hass} .defaultValue=${resolved} read-only></ha-yaml-editor>
          ${
            /*
             * Leaving should be as clean as arriving: the card becomes exactly what it
             * builds, and the template is out of its life. Only for a single copy - a
             * repeat ejecting to a pile of cards is the template earning its keep.
             */
            !items?.length && !isRegistrySource(this._config.for_each_from) && resolved && typeof resolved === 'object'
              ? html`
                  <ha-button @click=${(): void => this._eject(resolved)}>
                    ${localize(this._ejectPending ? 'editor.eject_confirm' : 'editor.eject', undefined, this.hass)}
                  </ha-button>
                `
              : html``
          }
        </div>
      </ha-expansion-panel>
    `;
  }

  /*
   * A repeat inside one card stays inside that card's section, however wide the screen.
   * Offered only for a card sitting straight in a section of an ordinary sections view, as
   * saved - an unsaved edit has no place on the dashboard to convert yet.
   */
  private _renderSectionPerCopy(): TemplateResult {
    const ll = getLovelacePanel()?.config;
    if (!this._config || !ll || !findRepeatingCard(ll, this._config)) return html``;
    return html`
      <div class="section-per-copy">
        <p class="hint">${localize('editor.section_per_copy_hint', undefined, this.hass)}</p>
        ${this._sectionsError ? html`<ha-alert alert-type="error">${this._sectionsError}</ha-alert>` : html``}
        <ha-button @click=${this._sectionPerCopy}>
          ${localize(
            this._sectionsPending ? 'editor.section_per_copy_confirm' : 'editor.section_per_copy',
            undefined,
            this.hass,
          )}
        </ha-button>
      </div>
    `;
  }

  /*
   * Rewrites the dashboard rather than this card, so it saves through the dashboard - and
   * then closes the dialog, whose card no longer exists where the dialog would save it.
   */
  private async _sectionPerCopy(): Promise<void> {
    if (!this._sectionsPending) {
      this._sectionsPending = true;
      return;
    }
    this._sectionsPending = false;
    const panel = getLovelacePanel();
    const card = this._config;
    if (!panel || !card) return;
    try {
      await rewriteDashboards(this, this.hass, 'section_per_copy', [
        { urlPath: pageDashboard(), build: (config) => sectionPerCopy(config, card) },
      ]);
    } catch (err) {
      this._sectionsError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
      return;
    }
    let node: Node | null = this.parentNode instanceof ShadowRoot ? this.parentNode.host : this.parentNode;
    while (node && (node as Element).localName !== 'hui-dialog-edit-card') {
      node = node.parentNode instanceof ShadowRoot ? node.parentNode.host : node.parentNode;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node as any)?.closeDialog?.();
  }

  private _eject(resolved: unknown): void {
    if (!this._ejectPending) {
      this._ejectPending = true;
      return;
    }
    this._ejectPending = false;
    this._holdEjectUndo(resolved);
    fireEvent(this, 'config-changed', { config: resolved as Record<string, unknown> });
  }

  /*
   * Ejecting changes the card in the dialog, and the dialog is what saves it - so unlike the
   * other tools, nothing is written here. What is kept for undoing is the dashboard as it is
   * now, and as it will be once the dialog saves this card ejected: the card the dialog
   * opened with, swapped for what it builds. If the dialog saves anything else as well, or
   * is closed without saving, the dashboard will not match that, and undoing asks first.
   * A card not yet on the dashboard has nothing to put back.
   */
  private _holdEjectUndo(resolved: unknown): void {
    const panel = getLovelacePanel();
    if (!panel || !this._openedWith) return;
    const after = replaceCard(panel.config, this._openedWith, resolved as Record<string, unknown>);
    if (after === panel.config) return;
    holdUndo({
      operation: 'eject',
      at: Date.now(),
      dashboards: [{ urlPath: pageDashboard(), before: panel.config, after }],
    });
  }

  /*
   * Where the template being used is defined. A card is often the place you realise the
   * template itself needs changing, and the definition can be anywhere on the dashboard -
   * or on another one entirely, which is worth knowing before you go looking for it.
   */
  private _renderSource(template: TemplateConfig | undefined): TemplateResult {
    const name = this._config?.template;
    if (!name || !template || this._loadingTemplates) return html``;

    const location = findTemplateLocation(this._lovelace, name);
    if (!location) {
      return html`<p class="hint">${localize('editor.source_borrowed', undefined, this.hass)}</p>`;
    }
    if (location.declared || !location.view) {
      return html`<p class="hint">${localize('editor.source_declared', undefined, this.hass)}</p>`;
    }

    const { view } = location;
    const dashboard = document.location.pathname.split('/').slice(0, 2).join('/');
    // Translated whole, then split where the link goes, so the sentence keeps the
    // translator's word order around it.
    const [before, after] = splitAt(localize('editor.source_view', { view: '\u0001' }, this.hass), '\u0001');
    return html`<p class="hint">
      ${before}<a href=${`${dashboard}/${view.path || view.index}`} target="_blank" rel="noreferrer"
        >${view.title || view.path || localize('editor.untitled_view', undefined, this.hass)}</a
      >${after}
    </p>`;
  }

  /*
   * A template source's copies can be mappings of anything, so the names they supply are
   * only known once it has rendered - read from what it rendered, when it has, so those
   * names are not reported as missing.
   */
  private _renderedTemplateNames(): string[] {
    const source = this._config?.for_each_from;
    const template = sourceTemplate(source);
    if (!this.hass || template === undefined) return [];
    if (!Object.prototype.hasOwnProperty.call(this._renderedTemplates, template)) return [];
    const names = new Set<string>();
    const items = resolveRegistryItems(this.hass, source, { rendered: this._renderedTemplates });
    for (const item of items) for (const name of Object.keys(item)) names.add(name);
    return [...names];
  }

  /** Renders a template source's Jinja once for the preview, then draws again. */
  private _renderEditorTemplate(template: string): void {
    if (!this.hass || this._renderingTemplates.has(template)) return;
    this._renderingTemplates.add(template);
    void renderTemplateOnce(this.hass, template).then((render) => {
      this._renderingTemplates.delete(template);
      this._renderedTemplates = { ...this._renderedTemplates, [template]: render };
    });
  }

  /*
   * What a registry repeat matches, as it is being written. The filters are powerful and
   * completely invisible until the card is saved and looked at, so a typo in a domain or an
   * area name reads as "this card is broken" rather than "nothing matched that". Counting
   * here turns writing them into something you can see working.
   */
  private _renderMatches(): TemplateResult {
    const source = this._config?.for_each_from;
    if (!this.hass || !isRegistrySource(source)) return html``;

    // A category is only known once fetched, and the card fetches it for itself - the
    // editor has to as well, or every category filter would preview as matching nothing.
    if (wantsCategories(source) && !categoryRegistry()) {
      void loadCategories(this.hass).then(() => this.requestUpdate());
    }

    const template = sourceTemplate(source);
    if (template !== undefined) {
      // Own keys only: the text is the user's, and `constructor` is a template too.
      const render = Object.prototype.hasOwnProperty.call(this._renderedTemplates, template)
        ? this._renderedTemplates[template]
        : undefined;
      if (!render) {
        this._renderEditorTemplate(template);
        return html`<p class="hint">${localize('editor.matches_template_pending', undefined, this.hass)}</p>`;
      }
      const listed = templateList(render);
      if (!('list' in listed)) {
        // The editor's own wording: the console's names the card and quotes the Jinja, both of
        // which are already in front of whoever is editing it.
        const key = listed.problem === 'error' ? 'editor.matches_template_failed' : 'editor.matches_template_not_list';
        return html`<ha-alert alert-type="warning"> ${localize(key, { detail: listed.detail }, this.hass)} </ha-alert>`;
      }
    }

    let matched: Record<string, unknown>[] = [];
    try {
      matched = resolveRegistryItems(this.hass, source, {
        ...sourceContext(this._lovelace),
        rendered: this._renderedTemplates,
      });
    } catch {
      return html``;
    }

    if (!matched.length) {
      return html`<ha-alert alert-type="warning">
        ${localize(
          'editor.matches_none',
          { but: this._config?.empty ? localize('editor.matches_none_but_empty', undefined, this.hass) : '' },
          this.hass,
        )}
      </ha-alert>`;
    }

    // The names, not the whole mappings: it is a sanity check on the filters, not a data
    // dump, and a sweep of the house should not fill the dialog.
    const shown = matched.slice(0, MATCHES_SHOWN);
    const label = (item: Record<string, unknown>): string =>
      String(
        item.entity ??
          item.area_id ??
          item.navigation_path ??
          item.item ??
          item.name ??
          `${(item.total as number) ?? ''}`,
      );

    return html`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${
            matched.length === 1
              ? localize('editor.matches_header_one', undefined, this.hass)
              : localize('editor.matches_header_many', { count: matched.length }, this.hass)
          }
        </span>
        <div class="matches">
          <ul>
            ${shown.map((item) => html`<li>${label(item)}</li>`)}
          </ul>
          ${
            matched.length > shown.length
              ? html`<p class="hint">
                  ${localize('editor.matches_more', { count: matched.length - shown.length }, this.hass)}
                </p>`
              : html``
          }
          <p class="hint">
            ${localize(template === undefined ? 'editor.matches_hint' : 'editor.matches_template_hint', undefined, this.hass)}
          </p>
        </div>
      </ha-expansion-panel>
    `;
  }

  /*
   * A template that describes its variables gets a real control for each one, and a box
   * underneath for anything else the card sets. A template that does not is edited the
   * way it always has been, through that box alone.
   */
  private _formSchema(declarations: VariableDeclaration[], repeatable: boolean): unknown[] {
    const repeat = repeatable ? repeatSchema() : [];

    if (!declarations.length) return [...this._schema, ...repeat, ...fitSchema()];

    const field = (declaration: VariableDeclaration): Record<string, unknown> => ({
      name: VARIABLE_FIELD_PREFIX + declaration.name,
      label: declaration.label ?? declaration.name,
      helper: declaration.description,
      // A declared selector, then what its `type:` stands for, then its allowed values.
      selector: declarationSelector(declaration),
      required: declaration.required === true,
    });

    // Declarations sharing a `group:` fold into a collapsible section, so a template with
    // fifteen variables leads with its essentials. `name: ''` keeps the data flat - the
    // section is presentation, not a level in the config.
    const grouped: unknown[] = [];
    for (const bucket of groupDeclarations(declarations.filter((declaration) => !isCardDeclaration(declaration)))) {
      if (bucket.group === undefined) grouped.push(...bucket.declarations.map(field));
      else grouped.push({ name: '', type: 'expandable', title: bucket.group, schema: bucket.declarations.map(field) });
    }

    return [
      this._schema[0],
      ...grouped,
      {
        name: 'extras',
        label: localize('editor.extras_label', undefined, this.hass),
        helper: localize('editor.extras_helper', undefined, this.hass),
        selector: { object: {} },
      },
      ...repeat,
      ...fitSchema(),
    ];
  }

  private _formData(declarations: VariableDeclaration[]): Record<string, unknown> {
    if (!declarations.length) return this._config as Record<string, unknown>;

    const values = variableValues(this._config?.variables);
    const described = new Set(declarations.map((declaration) => declaration.name));
    const data: Record<string, unknown> = { template: this._config?.template };
    this._shownAs = new Map();
    for (const declaration of declarations) {
      if (!(declaration.name in values)) continue;
      const value = values[declaration.name];
      /*
       * A toggle shows anything that is not empty as on, so a typed boolean holding a word
       * `bool` does not read - `maybe` - looked set and valid. It is shown as the switch it
       * would be (a word bool reads as itself, anything else off), and the written value is
       * kept unless the switch is actually moved.
       */
      if (typeof value !== 'boolean' && 'boolean' in (declarationSelector(declaration) as object)) {
        const shown = TRUE_WORDS.has(String(value).trim().toLowerCase());
        this._shownAs.set(declaration.name, { shown, written: value });
        data[VARIABLE_FIELD_PREFIX + declaration.name] = shown;
      } else data[VARIABLE_FIELD_PREFIX + declaration.name] = value;
    }

    const extras = ownVariables(this._config?.variables).filter((entry) => {
      const name = variableName(entry);
      return name !== undefined && !described.has(name);
    });
    if (extras.length) data.extras = extras;
    if (this._config?.for_each !== undefined) data.for_each = this._config.for_each;
    if (this._config?.for_each_from !== undefined) data.for_each_from = this._config.for_each_from;
    if (this._config?.columns !== undefined) data.columns = this._config.columns;
    if (this._config?.min_column_width !== undefined) data.min_column_width = this._config.min_column_width;
    if (this._config?.empty !== undefined) data.empty = this._config.empty;
    if (this._config?.gap !== undefined) data.gap = this._config.gap;
    if (this._config?.fit !== undefined) data.fit = this._config.fit;
    if (this._config?.lazy !== undefined) data.lazy = this._config.lazy;
    if (this._config?.lazy_eager !== undefined) data.lazy_eager = this._config.lazy_eager;
    return data;
  }

  /*
   * Warnings, never errors: a template can be edited after the cards that use it, so a
   * card that looks wrong now may be right again in a moment. Nothing here stops a save.
   */
  private _renderDiagnostics(template: TemplateConfig | undefined, readable: boolean): TemplateResult {
    // Choosing by domain, the variables are shared by copies of different templates, so
    // what one of them leaves unset or unused says nothing about the others.
    if (!template || this._loadingTemplates || !readable || byDomainOf(this._config)) return html``;

    // The items' names count as supplied, so a variable only the items set is not
    // missing - but they are not the card's own, so they are never called unused.
    // Both kinds of repeat supply names to every copy, and neither is the card's own to
    // be called missing. A registry source supplies its set whether or not anything is
    // registered yet, so it is read from the source rather than from what it resolved to.
    const supplied = [
      ...forEachNames(this._config?.for_each),
      ...registryNames(this._config?.for_each_from),
      ...(isRegistrySource(this._config?.for_each_from) ? POSITION_NAMES : []),
      ...this._renderedTemplateNames(),
      // An entity the card rebuilds on stands for itself in a placeholder.
      ...rebuildOnEntities(this._config?.rebuild_on),
    ];
    const repeated = supplied.map((name) => ({ [name]: null }));
    const { missing, unused, required } = diagnoseInstance(this._config?.variables, template, repeated);
    const invalid = validateDeclared(this._config?.variables, template, this.hass);
    // A template can say which of its variables it cannot do without. Those are still not
    // errors that block a save - the template may be edited next - but they are the ones
    // worth reading first, so they are separated out and coloured accordingly.
    const optional = missing.filter((name) => !required.includes(name));
    /*
     * A card that has given up its box has nothing left for the style option to paint on:
     * the rules still exist, they just have no element with a size to apply to. Easily
     * done, and invisible when it happens, so it is worth saying out loud.
     */
    const paintsOnHost = HOST_SELECTOR.test(`${template.style ?? ''}\n${this._config?.style ?? ''}`);
    const fitHidesStyle = this._config?.fit === 'contents' && paintsOnHost;
    /*
     * A repeat in several columns keeps them all on a phone, squeezing each copy, unless
     * it is told how narrow a copy may get. Easy to miss: it looks right on the desktop
     * where it was set up.
     */
    const columns = Number(this._config?.columns);
    const repeats = this._config?.for_each !== undefined || this._config?.for_each_from !== undefined;
    const fixedColumns = repeats && columns > 1 && !(Number(this._config?.min_column_width) > 0);
    const kind = getThingType(template);
    const misplaced = misplacedOverrides(this._config, kind);
    return html`
      ${misplaced.map(
        (key) =>
          html`<ha-alert alert-type="warning">
            ${localize('editor.override_misplaced', { key, kind: kind as string, template: this._config?.template ?? '' }, this.hass)}
          </ha-alert>`,
      )}
      ${
        fixedColumns
          ? html`<ha-alert alert-type="info">
              ${localize('editor.columns_without_min_width', { columns }, this.hass)}
            </ha-alert>`
          : html``
      }
      ${
        fitHidesStyle
          ? html`<ha-alert alert-type="warning">${localize('editor.fit_hides_style', undefined, this.hass)}</ha-alert>`
          : html``
      }
      ${
        required.length
          ? html`<ha-alert alert-type="error">
              ${localize(
                required.length === 1 ? 'editor.required_one' : 'editor.required_many',
                { names: required.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${
        optional.length
          ? html`<ha-alert alert-type="warning">
              ${localize(
                optional.length === 1 ? 'editor.optional_one' : 'editor.optional_many',
                { names: optional.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${invalid.map(
        (each) =>
          html`<ha-alert alert-type="warning">
            ${localize('editor.invalid_value', { name: each.name, expected: each.expected }, this.hass)}
          </ha-alert>`,
      )}
      ${
        unused.length
          ? html`<ha-alert alert-type="info">
              ${localize(
                unused.length === 1 ? 'editor.unused_one' : 'editor.unused_many',
                { names: unused.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    const data = ev.detail.value;
    const declarations = getDeclarations(this._templates?.[data.template]);
    if (!declarations.length) {
      fireEvent(this, 'config-changed', { config: data });
      return;
    }

    const desired: VariablesConfig[] = [];
    for (const declaration of declarations) {
      let value = data[VARIABLE_FIELD_PREFIX + declaration.name];
      // A switch shown for a written word it was not moved from keeps the word.
      const shownAs = this._shownAs.get(declaration.name);
      if (shownAs && value === shownAs.shown) value = shownAs.written;
      // A field left alone or cleared sets nothing, so the template's own default keeps
      // working. An empty string can still be set through the box below.
      if (value !== undefined && value !== '') desired.push({ [declaration.name]: value });
    }
    if (Array.isArray(data.extras)) desired.push(...data.extras);

    const config = { ...this._config, template: data.template } as DeclutteringCardConfig;
    // Whatever shape the config was written in, what is saved back is the list form.
    const variables = mergeVariables(ownVariables(this._config?.variables), desired);
    if (variables.length) config.variables = variables;
    else delete config.variables;
    setOrDelete(config, 'for_each', data.for_each);
    setOrDelete(config, 'for_each_from', data.for_each_from);
    setOrDelete(config, 'columns', data.columns);
    setOrDelete(config, 'min_column_width', data.min_column_width);
    setOrDelete(config, 'empty', data.empty);
    setOrDelete(config, 'gap', data.gap);
    // Off is the default, so switching it off takes the key out rather than writing false.
    setOrDelete(config, 'lazy', data.lazy === true ? true : undefined);
    setOrDelete(config, 'lazy_eager', data.lazy_eager);

    fireEvent(this, 'config-changed', { config });
  }

  // The dropdown starts with this dashboard's templates and gains the borrowed ones once
  // the other dashboards have been read.
  private _loadBorrowedTemplates(): void {
    if (!mayBorrowTemplates(this._lovelace)) return;
    this._loadingTemplates = true;
    const place = this._editingPlace();
    collectAllTemplates(this.hass, this._lovelace, place.view, undefined, place.section)
      .then((templates) => {
        this._templates = templates;
        this._schema = undefined;
      })
      .finally(() => {
        this._loadingTemplates = false;
        this.requestUpdate();
      });
  }
}

class DeclutteringTemplate extends DeclutteringElement {
  @property({ type: Boolean, reflect: true }) preview = false;

  @state() private _template?: string;
  // The config the preview was last drawn from, and one still waiting on a borrowed parent.
  private _previewConfig?: DeclutteringTemplateConfig;
  private _pendingPreview?: DeclutteringTemplateConfig;

  static getConfigElement(): HTMLElement {
    return document.createElement(TEMPLATE_EDITOR_TAG);
  }

  static getStubConfig(): DeclutteringTemplateConfig {
    return {
      type: `custom:${TEMPLATE_TAG}`,
      template: 'follow_the_sun',
      card: {
        type: 'entity',
        entity: 'sun.sun',
      },
    };
  }

  static get styles(): CSSResult {
    return css`
      ${DeclutteringElement.styles}
      .badge {
        margin: 8px;
        color: var(--primary-color);
      }
      :host([preview]) {
        display: block !important;
        border: 1px solid var(--primary-color);
      }
    `;
  }

  // A different example picked for this template's preview in its editor.
  private _examplePicked = (ev: Event): void => {
    if ((ev as CustomEvent).detail?.template === this._template) this._rebuild();
  };

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(PREVIEW_EXAMPLE_EVENT, this._examplePicked);
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(PREVIEW_EXAMPLE_EVENT, this._examplePicked);
  }

  public setConfig(config: DeclutteringTemplateConfig): void {
    // A template card draws its own definition, so it is the outermost open template for
    // whatever that definition contains. When it is nested inside another template it also
    // inherits the chain stamped above it, so the same self-reference check a consumer makes
    // applies here - otherwise a template that reaches itself through a nested template card
    // would build level after level without end.
    this._openTemplates = chainOf(config);
    this._templateName = config.template;

    if (!config.template) {
      throw new Error(localize('error.missing_template_property'));
    }

    // Said rather than thrown, for the same reason as in DeclutteringCard: a throw in
    // setConfig hides the reason the loop is fixable behind "Configuration error".
    const cycle = findCycle(this._openTemplates, config.template);
    const tooDeep = this._openTemplates.length >= MAX_NESTING;
    if (cycle || tooDeep) {
      this._error = cycle ? describeCycle(cycle) : describeTooDeep(this._openTemplates);
      return;
    }
    this._error = undefined;

    this._template = config.template;
    this._previewConfig = config;

    /*
     * The preview draws the template the way a card using it would get it: its parent
     * folded in, and the dashboard's and the view's decluttering_defaults applied. Drawn
     * from the raw config, a template that leaves a value to the dashboard previewed with
     * the brackets still in it, and one built with `extends` showed only its own few lines
     * (upstream issue #125). Outside a dashboard there is nothing to add, and it is drawn
     * as written.
     */
    const ll = getLovelaceConfig();
    const place = this._place(ll);
    const resolved = collectTemplates(ll, place.view, config, place.section)[config.template] ?? config;

    // An `extends` still standing means the parent is not on this dashboard. It may be on
    // one this dashboard borrows from, which has to be fetched, so drawing waits for hass
    // - drawn now, a child with no card of its own would fail before its parent arrived.
    const unresolved = parentsOf(resolved).length > 0;
    if (unresolved && mayBorrowTemplates(ll)) {
      this._pendingPreview = config;
      if (this._hass) this.hassAvailable(this._hass);
      return;
    }
    this._pendingPreview = undefined;
    // The config passed here IS the template, so its style is picked up as the
    // template's own - passing it again as the instance style would emit it twice.
    // Drawn with the example picked in the editor, when there is one, or the defaults as ever.
    const example = exampleVariables(resolved, previewExamples.get(config.template));
    this._setTemplateConfig(resolved, example, undefined, config.template);
  }

  protected _rebuild(): void {
    if (this._previewConfig) this.setConfig(this._previewConfig);
  }

  protected hassAvailable(hass: HomeAssistant): void {
    const config = this._pendingPreview;
    if (!config) return;
    this._pendingPreview = undefined;

    const ll = getLovelaceConfig();
    const place = this._place(ll);
    collectAllTemplates(hass, ll, place.view, config, place.section)
      // Drawn as written when the fetch fails, which says what is missing the same way it
      // always has.
      .catch(() => ({}) as Record<string, TemplateConfig>)
      .then((all) => {
        // A newer config may have arrived while the other dashboards were being fetched.
        if (this._previewConfig !== config) return;
        try {
          const resolved = all[config.template] ?? config;
          const example = exampleVariables(resolved, previewExamples.get(config.template));
          this._setTemplateConfig(resolved, example, undefined, config.template);
          this._error = undefined;
        } catch (err) {
          // Outside setConfig nobody catches a throw, so the card says it itself.
          this._error = (err as Error)?.message ?? String(err);
        }
      });
  }

  protected render(): TemplateResult | void {
    this.setHidden(!this.preview);
    if (this.preview) {
      return html`
        <div class="badge">${this._template}</div>
        ${super.render()}
      `;
    }
    return html``;
  }

  private setHidden(hidden: boolean): void {
    if (this.hasAttribute('hidden') !== hidden) {
      this.toggleAttribute('hidden', hidden);
      this.dispatchEvent(
        new Event('card-visibility-changed', {
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
}

class DeclutteringTemplateEditor extends LitElement implements LovelaceCardEditor {
  @state() private _config?: DeclutteringTemplateConfig;
  @state() private _selectedTab = 'settings';

  // The Share tab's import box: what has been pasted, whether it parsed, and what is
  // wrong with it. The name clash is held separately because it is a warning the user
  // is allowed to overrule, not a reason to refuse.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _importValue?: any;
  private _importParses = true;
  @state() private _importErrors: string[] = [];
  @state() private _importClash?: string;
  // What a pasted template would be allowed to do, when that is anything: shown by the first
  // press of Import, which then waits for a second. A paste nobody has checked is installed
  // the same way a shared post is, only without the stamp.
  @state() private _importRisks?: CommunityRisks;
  private _importArmedAt = 0;
  @state() private _copyState: '' | 'done' | 'failed' = '';

  // A pending suggestion, held between the press that works it out and the press that
  // applies it - rewriting somebody's card is not something to do on a single click.
  @state() private _suggestion?: { card: unknown; variables: VariableDeclaration[] };
  @state() private _suggestedNothing = false;

  // The Where-used counts, keyed by what they were computed from. The dialog re-renders
  // on every state change Home Assistant sends, and the answer only changes with the
  // template's name or the dashboard config - so the key, not an event, decides when to
  // recount. Not reactive state: whatever changes the key also changes state that renders.
  private _usages?: { name: string; ll: unknown; usages: TemplateUsages };

  @state() private _renameTo = '';
  @state() private _renameError?: string;
  @state() private _renaming = false;
  // The name the next press would rename to, set by the press before it. Renaming rewrites
  // cards outside this editor and saves at once, so it is asked twice like a suggestion is.
  @state() private _renamePending?: string;
  @state() private _duplicateTo = '';
  @state() private _duplicatePending?: string;
  @state() private _toolError?: string;
  @state() private _busy = false;
  @state() private _modernisePending = false;
  @state() private _installPending?: string;
  @state() private _librarySelected?: string;
  @state() private _libraryDestination: 'view' | 'root' = 'view';
  // Templates shared on GitHub: nothing until the button is pressed, then the list, and
  // what went wrong if fetching it did.
  @state() private _community?: CommunityList;
  @state() private _communityLoading = false;
  @state() private _communityError?: string;
  @state() private _communitySelected?: number;
  // Every template this dashboard can see, borrowed ones included, so a post cannot install
  // a template under a name that silently takes over one borrowed from another dashboard.
  // Nothing until the other dashboards have been read: until then the install button waits,
  // and if they could not be read it says so and stays off rather than guess.
  @state() private _communityKnown?: string[];
  @state() private _communityKnownFailed = false;
  // When Install was first pressed: the second press has to be a second decision, not the
  // other half of a double-click.
  private _installArmedAt = 0;
  @state() private _postCopyState: '' | 'done' | 'failed' = '';
  // Installed shared templates checked against the list: nothing until the button is pressed.
  @state() private _updates?: SharedUpdate[];
  @state() private _updatesLoading = false;
  @state() private _updatesError?: string;
  @state() private _updatePending?: string;
  private _updateArmedAt = 0;
  @state() private _remoteUsages?: { name: string; list: { urlPath: string; total: number }[] };
  // The templates this dashboard borrows: their names for the missing-template check, and
  // the templates themselves so a card using one can be checked for variables it never reads.
  @state() private _borrowed?: { ll: unknown; names?: string[]; templates?: Record<string, TemplateConfig> };
  // Every example on the dashboard built once per dashboard config, not on every render -
  // the panel re-renders on each state change Home Assistant sends.
  private _examplesChecked?: { ll: unknown; borrowed?: string[]; failed: ReturnType<typeof checkExamples> };
  @state() private _declutterOriginal?: Record<string, unknown>;
  @state() private _declutterPending = false;
  // The dashboards saved since the rewrite that could be undone, once undoing has found them.
  @state() private _undoChanged?: string[];
  // Sets of cards that are copies of each other but for a few values, worked out once per
  // dashboard config; the name typed for each set's template; and the set whose Make button
  // has been pressed once, with the name it was pressed for.
  private _similar?: {
    ll: unknown;
    cards: { label: string; config: Record<string, unknown> }[];
    groups: SimilarGroup[];
  };
  @state() private _similarNames: Record<string, string> = {};
  @state() private _similarPending?: string;
  // Searching every dashboard for a value: what was typed, and what the last search found.
  @state() private _searchQuery = '';
  @state() private _searching = false;
  @state() private _searchResult?: { query: string; cards: CardValueMatch[]; templates: TemplateValueMatch[] };
  // Renaming a variable: which, to what, and - once the first press has counted them - what
  // the second press would rewrite, here and on the dashboards borrowing this template.
  @state() private _varFrom?: string;
  @state() private _varTo = '';
  @state() private _varError?: string;
  @state() private _varPending?: {
    from: string;
    to: string;
    cards: number;
    templates: number;
    elsewhere: { urlPath: string; cards: number }[];
  };

  @property() public lovelace?: LovelaceConfig;
  @property() public hass?: HomeAssistant;

  /*
   * The dashboard as it is saved now. The dialog's `lovelace` is the copy it was opened
   * with, and every tool here saves the dashboard while the dialog stays open - read from
   * that copy, Where used said nothing used a template just renamed, and the health panel
   * kept offering to make a template of cards already made into one. The page's copy is
   * the one a save through the page replaces; the dialog's is for where there is no page.
   */
  private get _savedLovelace(): LovelaceConfig | null | undefined {
    return getLovelacePanel()?.config ?? this.lovelace ?? getLovelaceConfig();
  }

  private _loadedElements = false;

  // One shared instance, built on first use so it speaks the user's language - a fresh
  // schema object per render would mark every field dirty for no reason.
  private static _schema?: unknown[];
  private static schema(): unknown[] {
    DeclutteringTemplateEditor._schema ??= [
      {
        name: 'template',
        label: localize('template_editor.template_label'),
        selector: { text: {} },
      },
      {
        name: 'thingType',
        label: localize('template_editor.type_label'),
        selector: {
          select: {
            mode: 'dropdown',
            options: [
              { value: 'card', label: localize('template_editor.type_card') },
              { value: 'badge', label: localize('template_editor.type_badge') },
              { value: 'row', label: localize('template_editor.type_row') },
              { value: 'element', label: localize('template_editor.type_element') },
            ],
          },
        },
      },
      {
        name: 'description',
        label: localize('template_editor.description_label'),
        helper: localize('template_editor.description_helper'),
        selector: { text: { multiline: true } },
      },
      {
        name: 'variables',
        label: localize('template_editor.declarations_label'),
        helper: localize('template_editor.declarations_helper'),
        selector: { object: {} },
      },
      {
        name: 'default',
        label: localize('template_editor.defaults_label'),
        helper: localize('template_editor.defaults_helper'),
        selector: { object: {} },
      },
    ];
    return DeclutteringTemplateEditor._schema;
  }

  public setConfig(config: DeclutteringTemplateConfig): void {
    this._config = config;
    // Config can also arrive from outside - the dialog's YAML mode, an undo - and a
    // suggestion computed against the old card must not survive that any more than it
    // survives an edit made here.
    this._suggestion = undefined;
    this._suggestedNothing = false;
  }

  static get styles(): CSSResult {
    return css`
      ${DeclutteringElement.styles}
      ha-tab-group {
        display: block;
        margin-bottom: 16px;
      }
      .share h3 {
        margin: 0 0 4px;
      }
      .share h3 ~ h3 {
        margin-top: 24px;
      }
      .share .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .share ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      .share ha-button {
        margin-top: 8px;
      }
      .share a {
        color: var(--primary-color);
      }
      .suggest {
        margin-bottom: 16px;
      }
      .suggest ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      .usages ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      .usages ul {
        margin: 0;
        padding-left: 20px;
      }
      .usages li {
        margin-bottom: 4px;
      }
      .timings-header {
        margin: 16px 0 4px;
      }
      .timings {
        margin: 0 0 8px;
        padding-left: 20px;
        font-size: 0.9em;
      }
      .rename {
        margin-top: 24px;
      }
      .rename h3 {
        margin: 0 0 4px;
      }
      .rename .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .rename ha-textfield,
      .rename ha-input {
        display: block;
        width: 100%;
      }
      .rename ha-button {
        margin-top: 8px;
      }
      .order ul {
        margin: 0 0 8px;
        padding: 0;
        list-style: none;
      }
      .order li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 4px 0;
        border-bottom: 1px solid var(--divider-color);
      }
      .order .spacer {
        flex: 1;
      }
      .library {
        margin: 0 0 8px;
      }
      .library .hint {
        margin: 8px 0 0;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .library ha-button {
        margin-top: 8px;
      }
      .share .installed {
        margin: 0 0 8px;
        padding-left: 20px;
      }
      .share .installed li {
        margin-bottom: 8px;
      }
      .share .installed .status {
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .undo {
        margin-bottom: 8px;
      }
      .similar {
        margin: 8px 0 16px;
      }
      .similar h3 {
        margin: 0 0 4px;
        font-size: 1em;
      }
      .similar .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .similar ul {
        margin: 0 0 8px;
        padding-left: 20px;
      }
      .similar ha-textfield,
      .similar ha-input {
        display: block;
        width: 100%;
      }
      .similar ha-button {
        margin-top: 8px;
      }
      .undo .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
    `;
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    if (!this._loadedElements) {
      await loadCardEditorPicker();
      await loadRowEditor();
      this._loadedElements = true;
    }
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config) return html``;

    const error: Record<string, string | string[]> = {};
    if (!isVariablesShape(this._config.default) || !isVariablesShape(this._config.defaults)) {
      error.default = localize('error.variables_shape', undefined, this.hass);
    }
    if (this._config.variables !== undefined && !Array.isArray(this._config.variables)) {
      error.variables = localize('template_editor.declarations_shape', undefined, this.hass);
    }

    const data = {
      template: this._config.template,
      thingType: getThingType(this._config) ?? 'card',
      description: this._config.description,
      variables: this._config.variables,
      // `defaults:` is read as `default:`, so the field shows the two folded together.
      default: templateDefaults(this._config),
    };

    return html`
      <ha-tab-group .active=${this._selectedTab} @click=${this._activateTab}>
        <ha-tab-group-tab slot="nav" panel="settings">
          ${localize('template_editor.tab_settings', undefined, this.hass)}
        </ha-tab-group-tab>
        ${
          // The card editor edits `card:`, which a group has none of - its cards are edited as YAML.
          data.thingType === 'card' && this._config.group === undefined
            ? html`
                <ha-tab-group-tab slot="nav" panel="card">
                  ${localize('template_editor.tab_card', undefined, this.hass)}
                </ha-tab-group-tab>
                <ha-tab-group-tab slot="nav" panel="change_card">
                  ${localize('template_editor.tab_change_card', undefined, this.hass)}
                </ha-tab-group-tab>
              `
            : data.thingType === 'row'
              ? html`<ha-tab-group-tab slot="nav" panel="row">
                  ${localize('template_editor.tab_row', undefined, this.hass)}
                </ha-tab-group-tab>`
              : html``
        }
        <ha-tab-group-tab slot="nav" panel="usages">
          ${localize('template_editor.tab_usages', undefined, this.hass)}
        </ha-tab-group-tab>
        <ha-tab-group-tab slot="nav" panel="share">
          ${localize('template_editor.tab_share', undefined, this.hass)}
        </ha-tab-group-tab>
      </ha-tab-group>
      ${
        this._selectedTab === 'settings'
          ? html`
              ${this._renderInUse()} ${this._renderDiagnostics()} ${this._renderExamplePicker()}
              ${this._renderSuggest(data.thingType === 'card')} ${this._renderOrder()}
              <ha-form
                .hass=${this.hass}
                .data=${data}
                .schema=${DeclutteringTemplateEditor.schema()}
                .error=${error}
                .computeLabel=${(s): string => s.label ?? s.name}
                .computeHelper=${(s): string => s.helper ?? ''}
                @value-changed=${this._valueChanged}
              ></ha-form>
              ${this._renderLint()} ${this._renderDeclutter()}
            `
          : this._selectedTab === 'card'
            ? html`
                <hui-card-element-editor
                  .hass=${this.hass}
                  .lovelace=${this.lovelace}
                  .value=${this._config.card}
                  @config-changed=${this._cardChanged}
                ></hui-card-element-editor>
              `
            : this._selectedTab === 'change_card'
              ? html`
                  <hui-card-picker
                    .hass=${this.hass}
                    .lovelace=${this.lovelace}
                    @config-changed=${this._cardPicked}
                  ></hui-card-picker>
                `
              : this._selectedTab === 'row'
                ? html`
                    <hui-row-element-editor
                      .hass=${this.hass}
                      .lovelace=${this.lovelace}
                      .value=${this._config.row}
                      @config-changed=${this._rowChanged}
                    ></hui-row-element-editor>
                  `
                : this._selectedTab === 'usages'
                  ? this._renderUsages()
                  : this._selectedTab === 'share'
                    ? this._renderShare()
                    : html``
      }
    `;
  }

  /*
   * What the template says about itself against what it actually uses. Both are worth
   * knowing while writing one, and neither is a reason to refuse the configuration.
   */
  private _renderDiagnostics(): TemplateResult {
    if (!this._config || (this._config.variables !== undefined && !Array.isArray(this._config.variables))) {
      return html``;
    }

    const { unused, duplicated, contradictory } = diagnoseTemplate(this._config);
    return html`
      ${
        unused.length
          ? html`<ha-alert alert-type="info">
              ${localize(
                unused.length === 1 ? 'template_editor.declared_unused_one' : 'template_editor.declared_unused_many',
                { names: unused.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${
        duplicated.length
          ? html`<ha-alert alert-type="warning">
              ${localize(
                duplicated.length === 1 ? 'template_editor.duplicated_one' : 'template_editor.duplicated_many',
                { names: duplicated.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
      ${
        contradictory.length
          ? html`<ha-alert alert-type="warning">
              ${localize(
                contradictory.length === 1 ? 'template_editor.contradictory_one' : 'template_editor.contradictory_many',
                { names: contradictory.join(', ') },
                this.hass,
              )}
            </ha-alert>`
          : html``
      }
    `;
  }

  /*
   * A template with `examples:` can be previewed with any of them, which is how its author
   * sees the light and the cover version side by side without making two cards. Nothing
   * is saved: the pick only changes what the preview is drawn with.
   */
  private _renderExamplePicker(): TemplateResult {
    const name = this._config?.template;
    const sets = exampleSets(this._config);
    if (!name || !sets.length) return html``;
    const chosen = previewExamples.get(name);
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ example: chosen === undefined || chosen >= sets.length ? '' : String(chosen) }}
        .schema=${[
          {
            name: 'example',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: '', label: localize('template_editor.preview_defaults', undefined, this.hass) },
                  ...sets.map((_, index) => ({
                    value: String(index),
                    label: localize('template_editor.example_n', { number: index + 1 }, this.hass),
                  })),
                ],
              },
            },
          },
        ]}
        .computeLabel=${(): string => localize('template_editor.preview_example_label', undefined, this.hass)}
        @value-changed=${this._previewExamplePicked}
      ></ha-form>
    `;
  }

  private _previewExamplePicked(ev: CustomEvent): void {
    // Not part of the template's configuration, so it must not reach the settings handler.
    ev.stopPropagation();
    const name = this._config?.template;
    if (!name) return;
    const picked = (ev.detail.value as { example?: string }).example;
    if (picked === undefined || picked === '') previewExamples.delete(name);
    else previewExamples.set(name, Number(picked));
    window.dispatchEvent(new CustomEvent(PREVIEW_EXAMPLE_EVENT, { detail: { template: name } }));
    this.requestUpdate();
  }

  /*
   * The placeholders as typed, read for what will not work: brackets that do not pair, a
   * step nobody has heard of, an `or:` a `default:` never lets run, a condition on a
   * variable the template never mentions. Worked out again on every edit - it is a walk
   * over one template, and the moment to say so is while the mistake is being made.
   *
   * Names the template gets from elsewhere - a parent it extends, the dashboard's shared
   * declarations and defaults - are not this template's to declare, so they are read off
   * the template as the dashboard would resolve it.
   */
  private _renderLint(): TemplateResult {
    if (!this._config) return html``;
    const ll = this._savedLovelace;
    const resolved = collectTemplates(ll, undefined, this._config)[this._config.template];
    const findings = lintTemplate(this._config, definedNames(resolved));
    if (!findings.length) return html``;
    return html`${findings.map(
      (finding) =>
        html`<ha-alert alert-type=${finding.level}>
          ${localize(finding.key, finding.params, this.hass)}${
            finding.params.closest ? localize('error.did_you_mean', { closest: finding.params.closest }, this.hass) : ''
          }${finding.path ? localize('lint.where', { path: finding.path }, this.hass) : ''}
        </ha-alert>`,
    )}`;
  }

  /*
   * A declaration's place in the list is its place in the form every card using the
   * template gets, so changing the order meant hand-editing the YAML underneath - the very
   * thing the visual editor is for.
   */
  private _renderOrder(): TemplateResult {
    const declarations = getDeclarations(this._config);
    if (declarations.length < 2) return html``;

    return html`
      <div class="order">
        <p class="hint">${localize('template_editor.order_hint', undefined, this.hass)}</p>
        <ul>
          ${declarations.map(
            (declaration, index) => html`
              <li>
                <span>${declaration.label ?? declaration.name}</span>
                <span class="spacer"></span>
                <ha-icon-button
                  .path=${'M7,15L12,10L17,15H7Z'}
                  .disabled=${index === 0}
                  .label=${localize('template_editor.move_up', { name: declaration.name }, this.hass)}
                  @click=${(): void => this._move(index, -1)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${'M7,10L12,15L17,10H7Z'}
                  .disabled=${index === declarations.length - 1}
                  .label=${localize('template_editor.move_down', { name: declaration.name }, this.hass)}
                  @click=${(): void => this._move(index, 1)}
                ></ha-icon-button>
              </li>
            `,
          )}
        </ul>
      </div>
    `;
  }

  private _move(index: number, by: number): void {
    const declarations = [...getDeclarations(this._config)];
    const to = index + by;
    if (to < 0 || to >= declarations.length) return;
    [declarations[index], declarations[to]] = [declarations[to], declarations[index]];
    this._fireConfigChanged({ ...(this._config as DeclutteringTemplateConfig), variables: declarations });
  }

  /*
   * What a change to this template would break. The Where used tab says the same thing, but
   * only if you go and look - and the moment that matters is when the card is open in front
   * of you, about to be edited or deleted.
   */
  private _renderInUse(): TemplateResult {
    const name = this._config?.template;
    const ll = this._savedLovelace;
    if (!name || !ll) return html``;

    const { views, templates } = collectUsages(ll, name);
    const total = views.reduce((sum, view) => sum + view.count, 0) + templates.length;
    if (!total) return html``;

    return html`<ha-alert alert-type="info">
      ${localize(total === 1 ? 'template_editor.in_use_one' : 'template_editor.in_use_many', { total }, this.hass)}
    </ha-alert>`;
  }

  /*
   * Turning a card you already built into a template means deciding which parts of it
   * change between copies. The entities, names and icons in it almost always do, so they
   * are proposed for you - with each variable defaulting to the value it replaced, so the
   * template still renders exactly what the card did.
   */
  private _renderSuggest(isCard: boolean): TemplateResult {
    if (!isCard || !this._config?.card) return html``;

    return html`
      <div class="suggest">
        ${
          this._suggestedNothing
            ? html`<ha-alert alert-type="info">
                ${localize('template_editor.suggest_nothing', undefined, this.hass)}
              </ha-alert>`
            : html``
        }
        ${
          this._suggestion
            ? html`<ha-alert alert-type="warning">
                ${localize(
                  this._suggestion.variables.length === 1
                    ? 'template_editor.suggest_confirm_one'
                    : 'template_editor.suggest_confirm_many',
                  { names: this._suggestion.variables.map((variable) => variable.name).join(', ') },
                  this.hass,
                )}
              </ha-alert>`
            : html``
        }
        <ha-button @click=${this._suggest}>
          ${localize(
            this._suggestion ? 'template_editor.suggest_anyway' : 'template_editor.suggest_button',
            undefined,
            this.hass,
          )}
        </ha-button>
      </div>
    `;
  }

  private _suggest(): void {
    if (!this._config?.card) return;

    if (this._suggestion) {
      const config = { ...this._config, card: this._suggestion.card };
      // Existing declarations are kept: the suggestion was worked out around them.
      config.variables = [...getDeclarations(this._config), ...this._suggestion.variables];
      this._suggestion = undefined;
      this._fireConfigChanged(config as DeclutteringTemplateConfig);
      return;
    }

    this._suggestedNothing = false;
    const taken = getDeclarations(this._config).map((declaration) => declaration.name);
    const suggestion = suggestVariables(this._config.card, taken);
    if (!suggestion.variables.length) {
      this._suggestedNothing = true;
      return;
    }
    this._suggestion = suggestion;
  }

  /*
   * What a change to this template would affect. A template is worth changing only when
   * you know what it is holding up, and the answer is not visible from the template card
   * itself - the cards using it can be anywhere on the dashboard.
   */
  private _renderUsages(): TemplateResult {
    const name = this._config?.template;
    if (!name) return html``;

    // The fallback matters in the editor contexts that never set lovelace. When neither
    // source yields a config, say so - an unreadable dashboard must not present itself
    // as one where nothing uses the template.
    const ll = this._savedLovelace;
    if (!ll) {
      return html`<div class="usages">
        <ha-alert alert-type="warning">${localize('template_editor.usages_unreadable', undefined, this.hass)}</ha-alert>
      </div>`;
    }
    if (this._usages?.name !== name || this._usages.ll !== ll) {
      this._usages = { name, ll, usages: collectUsages(ll, name) };
    }
    const { views, templates } = this._usages.usages;
    const total = views.reduce((sum, view) => sum + view.count, 0);
    const dashboard = document.location.pathname.split('/').slice(0, 2).join('/');

    return html`
      <div class="usages">
        ${
          total === 0 && !templates.length
            ? html`<ha-alert alert-type="info">
                ${localize('template_editor.usages_none', { name }, this.hass)}
              </ha-alert>`
            : html`
                <p class="hint">
                  ${localize(
                    total === 1 ? 'template_editor.usages_one' : 'template_editor.usages_many',
                    { total, name },
                    this.hass,
                  )}
                </p>
                <ul>
                  ${views.map(
                    // A view with no path is addressed by its position, which is how Home
                    // Assistant itself links such views.
                    (view) => html`
                      <li>
                        <a href=${`${dashboard}/${view.path || view.index}`} target="_blank" rel="noreferrer">
                          ${view.title || view.path || localize('template_editor.untitled_view', undefined, this.hass)}
                        </a>
                        —
                        ${
                          view.count === 1
                            ? localize('template_editor.used_once', undefined, this.hass)
                            : localize('template_editor.used_times', { count: view.count }, this.hass)
                        }
                      </li>
                    `,
                  )}
                </ul>
              `
        }
        ${
          templates.length
            ? html`<ha-alert alert-type="info">
                ${localize(
                  templates.length === 1 ? 'template_editor.used_by_template' : 'template_editor.used_by_templates',
                  { names: templates.join(', ') },
                  this.hass,
                )}
              </ha-alert>`
            : html``
        }
        ${this._renderElsewhere(name)} ${this._renderImpact(ll, name)} ${this._renderHealth(ll)}
        ${this._renderSimilar(ll)} ${this._renderSearch()} ${this._renderRename(name, total)}
        ${this._renderRenameVariable(name)} ${this._renderDuplicate(name)} ${this._renderModernise()}
        ${this._toolError ? html`<ha-alert alert-type="error">${this._toolError}</ha-alert>` : html``}
      </div>
    `;
  }

  /*
   * Everything the console would have muttered about this dashboard, in one place: cards
   * pointing at templates that are not there, cards leaving variables unset, templates
   * nothing uses. The sweep is cheap and honest, so it simply runs.
   */
  private _renderHealth(ll: LovelaceConfig | null | undefined): TemplateResult {
    // A dashboard that borrows templates has names defined elsewhere, and the sweep must
    // know them or every card using one is reported as pointing at nothing. Fetched once
    // per dashboard config; until it lands, "does not exist" is held back rather than said.
    const borrowing = mayBorrowTemplates(ll);
    if (borrowing && this._borrowed?.ll !== ll) {
      this._borrowed = { ll };
      const local = new Set(Object.keys(collectTemplates(ll)));
      void collectAllTemplates(this.hass, ll).then((all) => {
        if (this._borrowed?.ll === ll) {
          this._borrowed = { ll, names: Object.keys(all).filter((name) => !local.has(name)), templates: all };
        }
      });
    }
    const pending = borrowing && !this._borrowed?.names;
    const full = checkDashboard(ll, borrowing ? (this._borrowed?.names ?? []) : []);
    const report = pending ? { ...full, missingTemplates: [] } : full;
    const loops = extendsLoops(ll);
    const retired = deprecatedInUse(ll);
    // Held back, like a missing template, until the borrowed names are known.
    const lent = this._borrowed?.names;
    const checked = this._examplesChecked;
    if (!pending && (checked?.ll !== ll || checked?.borrowed !== lent)) {
      this._examplesChecked = {
        ll,
        borrowed: lent,
        failed: checkExamples(collectTemplates(ll), lent ?? [], this.hass),
      };
    }
    const failedExamples = pending ? [] : (this._examplesChecked?.failed ?? []);
    const unread = checkUnreadVariables(ll, this._borrowed?.templates ?? collectTemplates(ll));
    const healthy =
      !report.missingTemplates.length &&
      !report.unsetVariables.length &&
      !report.unusedTemplates.length &&
      !loops.length &&
      !retired.length &&
      !failedExamples.length &&
      !unread.length;
    return html`
      <ha-expansion-panel outlined>
        <span slot="header">${localize('tools.health_header', undefined, this.hass)}</span>
        ${this._renderUndo()}
        ${
          healthy
            ? html`<p class="hint">${localize('tools.health_ok', undefined, this.hass)}</p>`
            : html`
                ${failedExamples.map(
                  (each) =>
                    html`<ha-alert alert-type="error">
                      ${localize(
                        'tools.health_example',
                        { template: each.template, number: each.example, problems: each.problems.join(' ') },
                        this.hass,
                      )}
                    </ha-alert>`,
                )}
                ${loops.map(
                  (loop) =>
                    html`<ha-alert alert-type="error">
                      ${localize('tools.health_extends_loop', { path: loop.join(' → ') }, this.hass)}
                    </ha-alert>`,
                )}
                ${report.missingTemplates.map(
                  (each) =>
                    html`<ha-alert alert-type="error">
                      ${localize('tools.health_missing', { template: each.template, count: each.count }, this.hass)}${
                        each.closest ? localize('error.did_you_mean', { closest: each.closest }, this.hass) : ''
                      }
                    </ha-alert>`,
                )}
                ${report.unsetVariables.map(
                  (each) =>
                    html`<ha-alert alert-type="warning">
                      ${localize(
                        'tools.health_unset',
                        { template: each.template, names: each.names.join(', '), count: each.count },
                        this.hass,
                      )}
                    </ha-alert>`,
                )}
                ${retired.map((each) => {
                  const uses = [
                    ...each.views.map((view) =>
                      localize(
                        'tools.health_view_uses',
                        {
                          view: view.title || localize('template_editor.untitled_view', undefined, this.hass),
                          count: view.count,
                        },
                        this.hass,
                      ),
                    ),
                    ...each.templates.map((name) => localize('tools.health_template_uses', { name }, this.hass)),
                  ].join(', ');
                  return html`<ha-alert alert-type="warning">
                    ${
                      each.message
                        ? localize(
                            'tools.health_deprecated_because',
                            { template: each.template, message: each.message, uses },
                            this.hass,
                          )
                        : localize('tools.health_deprecated', { template: each.template, uses }, this.hass)
                    }
                  </ha-alert>`;
                })}
                ${unread.map(
                  (each) =>
                    html`<ha-alert alert-type="warning">
                      ${localize(
                        'tools.health_unread',
                        {
                          template: each.template,
                          name: each.name,
                          count: each.count,
                          view:
                            each.view.title ||
                            each.view.path ||
                            localize('template_editor.untitled_view', undefined, this.hass),
                        },
                        this.hass,
                      )}${
                        each.where === 'variables'
                          ? ''
                          : localize(`tools.health_unread_${each.where}`, undefined, this.hass)
                      }${each.closest ? localize('error.did_you_mean', { closest: each.closest }, this.hass) : ''}
                    </ha-alert>`,
                )}
                ${
                  report.unusedTemplates.length
                    ? html`<ha-alert alert-type="info">
                        ${localize('tools.health_unused', { names: report.unusedTemplates.join(', ') }, this.hass)}
                      </ha-alert>`
                    : html``
                }
              `
        }
        ${this._renderTimings()}
      </ha-expansion-panel>
    `;
  }

  /*
   * Which templates the page has spent its time building, since it loaded. A slow
   * dashboard is otherwise a guess at which of forty cards is the heavy one; every card
   * notes its build as it goes, so this only has to read the list back. Nothing here is
   * kept past the page.
   */
  private _renderTimings(): TemplateResult {
    const entries = BUILD_LOG.entries();
    const ms = (value: number): string => value.toFixed(1);
    const header = html`<h4 class="timings-header">${localize('tools.timings_header', undefined, this.hass)}</h4>`;
    if (!entries.length) {
      return html`${header}
        <p class="hint">${localize('tools.timings_none', undefined, this.hass)}</p>`;
    }
    const { byTotal, byMax, repeats } = slowestBuilds(entries);
    return html`
      ${header}
      <p class="hint">${localize('tools.timings_hint', { count: entries.length }, this.hass)}</p>
      <p class="hint">${localize('tools.timings_by_total', undefined, this.hass)}</p>
      <ul class="timings">
        ${byTotal.map(
          (each) =>
            html`<li>
              ${localize(
                each.builds === 1 ? 'tools.timings_total_row_one' : 'tools.timings_total_row',
                { template: each.template, total: ms(each.total), builds: each.builds, max: ms(each.max) },
                this.hass,
              )}
            </li>`,
        )}
      </ul>
      <p class="hint">${localize('tools.timings_by_max', undefined, this.hass)}</p>
      <ul class="timings">
        ${byMax.map(
          (each) =>
            html`<li>
              ${localize('tools.timings_max_row', { template: each.template, max: ms(each.max) }, this.hass)}
            </li>`,
        )}
      </ul>
      ${
        repeats.length
          ? html`
              <p class="hint">${localize('tools.timings_repeats', undefined, this.hass)}</p>
              <ul class="timings">
                ${repeats.map(
                  (each) =>
                    html`<li>
                      ${localize(
                        each.name ? 'tools.timings_repeat_named_row' : 'tools.timings_repeat_row',
                        { template: each.template, name: each.name ?? '', copies: each.copies },
                        this.hass,
                      )}
                    </li>`,
                )}
              </ul>
            `
          : html``
      }
    `;
  }

  /*
   * The way back from the last rewrite, for as long as there is one - the toast that offered
   * it is gone in seconds. Undoing over a dashboard somebody has saved since would lose that
   * too, so the first press finds out and says so, and only a second press goes ahead.
   */
  private _renderUndo(): TemplateResult {
    const held = heldUndo();
    if (!held) return html``;
    const operation = operationLabel(held.operation, this.hass);
    const time = new Date(held.at).toLocaleTimeString(this.hass?.locale?.language);
    return html`
      <div class="undo">
        <p class="hint">${localize('undo.held', { operation, time }, this.hass)}</p>
        ${
          this._undoChanged
            ? html`<ha-alert alert-type="warning">
                ${localize('undo.changed_here', { operation, dashboards: this._undoChanged.join(', ') }, this.hass)}
              </ha-alert>`
            : html``
        }
        <ha-button .disabled=${this._busy} @click=${this._undo}>
          ${localize(this._undoChanged ? 'undo.anyway_button' : 'undo.button', { operation }, this.hass)}
        </ha-button>
      </div>
    `;
  }

  private async _undo(): Promise<void> {
    const held = heldUndo();
    if (!held) return;
    this._busy = true;
    try {
      const outcome = await undoFrom(this, this.hass, held, !!this._undoChanged, false);
      this._undoChanged = outcome?.result === 'changed' ? outcome.dashboards : undefined;
    } finally {
      this._busy = false;
    }
  }

  /*
   * The copy-pasted cards a template would replace, found rather than hunted for: sets of
   * cards with the same type and the same structure that differ only in a few values. Each
   * set can become a template in one go - the first press shows the template and what the
   * first card becomes, the second saves. The sets are worked out once per dashboard config.
   */
  private _renderSimilar(ll: LovelaceConfig | null | undefined): TemplateResult {
    if (this._similar?.ll !== ll) {
      const found = listPlainCards(ll);
      this._similar = { ll, cards: found, groups: findSimilarCards(found.map((card) => card.config)) };
    }
    const { cards, groups } = this._similar as NonNullable<typeof this._similar>;
    if (!groups.length) return html``;
    const taken = Object.keys(collectTemplates(ll));
    return html`
      <ha-expansion-panel outlined>
        <span slot="header">
          ${localize(groups.length === 1 ? 'tools.similar_header_one' : 'tools.similar_header', { count: groups.length }, this.hass)}
        </span>
        <p class="hint">${localize('tools.similar_hint', { max: MAX_DIFFERING }, this.hass)}</p>
        ${groups.slice(0, SIMILAR_SHOWN).map((group) => this._renderSimilarGroup(group, cards, taken))}
      </ha-expansion-panel>
    `;
  }

  private _renderSimilarGroup(
    group: SimilarGroup,
    cards: { label: string; config: Record<string, unknown> }[],
    taken: string[],
  ): TemplateResult {
    const members = group.indices.map((index) => cards[index]);
    const made = templateFromSimilar(members.map((member) => member.config));
    const name = (
      this._similarNames[group.key] ??
      suggestTemplateName(
        group.type,
        taken,
        members.map((member) => member.config),
      )
    ).trim();
    const armed = this._similarPending === `${group.key}\u0000${name}`;
    const clash = taken.includes(name);
    return html`
      <div class="similar">
        <h3>${localize('tools.similar_group', { count: members.length, type: group.type }, this.hass)}</h3>
        <p class="hint">${localize('tools.similar_differ', { names: made.names.join(', ') }, this.hass)}</p>
        <ul>
          ${members.slice(0, SIMILAR_MEMBERS_SHOWN).map((member) => html`<li>${member.label}</li>`)}
        </ul>
        ${
          members.length > SIMILAR_MEMBERS_SHOWN
            ? html`<p class="hint">
                ${localize('editor.matches_more', { count: members.length - SIMILAR_MEMBERS_SHOWN }, this.hass)}
              </p>`
            : html``
        }
        ${clash ? html`<ha-alert alert-type="error">${localize('tools.name_taken', { name }, this.hass)}</ha-alert>` : html``}
        ${
          armed
            ? html`
                <ha-alert alert-type="warning">
                  ${localize('tools.similar_confirm', { name, count: members.length }, this.hass)}
                </ha-alert>
                <p class="hint">${localize('tools.similar_template', { name }, this.hass)}</p>
                ${keyed(
                  `${group.key}\u0000${name}`,
                  html`<ha-yaml-editor
                    .hass=${this.hass}
                    .defaultValue=${{ [name]: made.template }}
                    read-only
                  ></ha-yaml-editor>`,
                )}
                <p class="hint">${localize('tools.similar_first_card', undefined, this.hass)}</p>
                ${renderDiff(members[0].config, similarReplacement(name, made.variables[0], made.layout[0]), this.hass)}
              `
            : html``
        }
        ${textField({
          label: localize('tools.similar_name', undefined, this.hass),
          value: name,
          disabled: this._busy,
          onInput: (value) => {
            this._similarNames = { ...this._similarNames, [group.key]: value };
            this._similarPending = undefined;
          },
        })}
        <ha-button
          .disabled=${this._busy || !name || clash}
          @click=${(): void => void this._makeTemplate(group, members, name)}
        >
          ${localize(armed ? 'tools.similar_make_anyway' : 'tools.similar_make', undefined, this.hass)}
        </ha-button>
      </div>
    `;
  }

  private async _makeTemplate(
    group: SimilarGroup,
    members: { label: string; config: Record<string, unknown> }[],
    name: string,
  ): Promise<void> {
    const key = `${group.key}\u0000${name}`;
    if (this._similarPending !== key) {
      this._similarPending = key;
      return;
    }
    const saved = await this._saveDashboard(
      (config) =>
        makeTemplateFromSimilar(
          config,
          members.map((member) => member.config),
          name,
        ),
      'make_template',
    );
    if (saved) {
      this._similarPending = undefined;
      const names = { ...this._similarNames };
      delete names[group.key];
      this._similarNames = names;
    }
  }

  /*
   * The on-ramp: a dashboard full of copy-pasted cards becomes a template by picking one
   * of them. The picked card becomes this template's card, ready for "Suggest variables";
   * once the template is saved, the original can be swapped for a card that uses it.
   */
  private _renderDeclutter(): TemplateResult {
    const ll = this._savedLovelace;
    const cards = listPlainCards(ll);
    if (!cards.length || !this._config) return html``;
    const name = this._config.template;
    const saved = !!name && name in collectTemplates(ll);
    return html`
      <ha-expansion-panel outlined>
        <span slot="header">${localize('template_editor.declutter_header', undefined, this.hass)}</span>
        <p class="hint">${localize('template_editor.declutter_hint', undefined, this.hass)}</p>
        <ha-form
          .hass=${this.hass}
          .data=${{}}
          .schema=${[
            {
              name: 'pick',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: cards.map((card, index) => ({ value: String(index), label: card.label })),
                },
              },
            },
          ]}
          .computeLabel=${(): string => localize('template_editor.declutter_pick', undefined, this.hass)}
          @value-changed=${(ev: CustomEvent): void => this._declutterPicked(ev, cards)}
        ></ha-form>
        ${
          this._declutterOriginal
            ? html`
                <ha-button .disabled=${this._busy || !saved} @click=${this._declutterReplace}>
                  ${localize(
                    this._declutterPending
                      ? 'template_editor.declutter_replace_confirm'
                      : 'template_editor.declutter_replace',
                    undefined,
                    this.hass,
                  )}
                </ha-button>
                ${!saved ? html`<p class="hint">${localize('template_editor.declutter_save_first', undefined, this.hass)}</p>` : html``}
              `
            : html``
        }
      </ha-expansion-panel>
    `;
  }

  private _declutterPicked(ev: CustomEvent, cards: { label: string; config: Record<string, unknown> }[]): void {
    ev.stopPropagation();
    const index = Number((ev.detail.value as { pick?: string }).pick);
    const picked = cards[index];
    if (!picked || !this._config) return;
    this._declutterOriginal = picked.config;
    this._declutterPending = false;
    this._suggestion = undefined;
    this._suggestedNothing = false;
    // A copy, so editing the template never reaches back into the original card.
    this._fireConfigChanged({ ...this._config, card: JSON.parse(JSON.stringify(picked.config)) });
  }

  private async _declutterReplace(): Promise<void> {
    const name = this._config?.template;
    const original = this._declutterOriginal;
    if (!name || !original) return;
    if (!this._declutterPending) {
      this._declutterPending = true;
      return;
    }
    const saved = await this._saveDashboard(
      (config) => replaceCard(config, original, { type: 'custom:decluttering-card-plus', template: name }),
      'declutter',
    );
    if (saved) {
      this._declutterPending = false;
      this._declutterOriginal = undefined;
    }
  }

  /*
   * The same name counted on every other dashboard - looked at, never written. Renaming
   * and deleting here still touch only this dashboard, and this is what says whether
   * that matters today.
   */
  private _renderElsewhere(name: string): TemplateResult {
    if (this._remoteUsages?.name !== name) {
      this._remoteUsages = { name, list: [] };
      const ownPath = document.location.pathname.split('/').filter(Boolean)[0];
      void usagesOnOtherDashboards(this.hass, name, ownPath).then((list) => {
        if (this._remoteUsages?.name === name) this._remoteUsages = { name, list };
      });
    }
    const list = this._remoteUsages.list;
    if (!list.length) return html``;
    const summary = list.map((each) => `${each.urlPath} (${each.total})`).join(', ');
    return html`<ha-alert alert-type="info">
      ${localize('template_editor.usages_elsewhere', { list: summary }, this.hass)}
    </ha-alert>`;
  }

  /*
   * One real card, built against the template as it stands in this editor - unsaved edits
   * and all - so "this changes 12 cards" comes with a look at what one of them becomes
   * before anything is saved.
   */
  private _renderImpact(ll: LovelaceConfig | null | undefined, name: string): TemplateResult {
    const usage = firstUsage(ll, name);
    if (!usage || !this._config) return html``;
    /*
     * Built twice - once from the template as the dashboard has it saved, once with the
     * edits in this editor put in its place - and the two compared, so the preview says
     * what changes rather than leaving the reader to find it. Both go through the same
     * collection, so a parent template and the shared values are folded in on each side.
     */
    const build = (template: TemplateConfig | undefined): unknown => {
      if (!template) return undefined;
      return deepReplace(usage.variables, template, thingContent(template), name, this.hass, true);
    };
    let before: unknown;
    let after: unknown;
    try {
      before = build(collectTemplates(ll)[name]);
      after = build(collectTemplates(ll, undefined, this._config)[name]);
    } catch {
      return html``;
    }
    return html`
      <ha-expansion-panel outlined>
        <span slot="header">${localize('template_editor.impact_header', undefined, this.hass)}</span>
        <p class="hint">${localize('template_editor.impact_diff_hint', undefined, this.hass)}</p>
        ${renderDiffWithFull(before, after, this.hass)}
      </ha-expansion-panel>
    `;
  }

  /*
   * A template is a self-contained block of configuration, so handing one to another
   * person is mostly a matter of writing it out. What does not travel with it - the
   * custom cards it is built from, the other templates it calls - is named above the
   * box, because whoever receives it cannot tell from the YAML alone.
   */
  private _renderShare(): TemplateResult {
    const { payload, notes } = buildExport(this._config, collectTemplates(this._savedLovelace));

    return html`
      <div class="share">
        <h3>${localize('share.export_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.export_hint', undefined, this.hass)}</p>
        ${notes.map((note) => html`<ha-alert alert-type="info">${note}</ha-alert>`)}
        <ha-yaml-editor id="export" .hass=${this.hass} .defaultValue=${payload} read-only></ha-yaml-editor>
        <ha-button @click=${this._copyExport}>
          ${
            this._copyState === 'done'
              ? localize('share.copied', undefined, this.hass)
              : this._copyState === 'failed'
                ? localize('share.copy_failed', undefined, this.hass)
                : localize('share.copy', undefined, this.hass)
          }
        </ha-button>
        <ha-button @click=${this._copyPost}>
          ${
            this._postCopyState === 'done'
              ? localize('share.copied', undefined, this.hass)
              : this._postCopyState === 'failed'
                ? localize('share.copy_failed', undefined, this.hass)
                : localize('share.post_copy', undefined, this.hass)
          }
        </ha-button>
        <p class="hint">
          ${localize('share.post_hint', undefined, this.hass)}
          <a href=${COMMUNITY_POST_URL} target="_blank" rel="noopener noreferrer"
            >${localize('share.post_open', undefined, this.hass)}</a
          >
        </p>

        <h3>${localize('share.import_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.import_hint', undefined, this.hass)}</p>
        <ha-yaml-editor .hass=${this.hass} @value-changed=${this._importChanged}></ha-yaml-editor>
        ${this._importErrors.map((error) => html`<ha-alert alert-type="error">${error}</ha-alert>`)}
        ${
          this._importClash
            ? html`<ha-alert alert-type="warning">
                ${localize('share.import_clash', { name: this._importClash }, this.hass)}
              </ha-alert>`
            : html``
        }
        ${this._importRisks ? this._renderRisks(this._importRisks, 'share.import_risks') : html``}
        <ha-button @click=${this._import}>
          ${localize(this._importClash || this._importRisks ? 'share.import_anyway' : 'share.import', undefined, this.hass)}
        </ha-button>
        ${
          this._importClash
            ? html`<ha-button @click=${this._importAsCopy}>
                ${localize('share.import_copy', undefined, this.hass)}
              </ha-button>`
            : html``
        }

        <h3>${localize('share.library_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.library_hint', undefined, this.hass)}</p>
        ${this._renderLibrary()}

        <h3>${localize('share.community_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('share.community_hint', undefined, this.hass)}</p>
        ${this._renderCommunity()} ${this._renderInstalled()}
        ${this._toolError ? html`<ha-alert alert-type="error">${this._toolError}</ha-alert>` : html``}
      </div>
    `;
  }

  /*
   * The library, but for templates other people have posted. Fetching is the user's call -
   * the button is the only thing that reaches GitHub - and what a post holds is shown in
   * full before anything is installed, because nobody has checked it.
   */
  private _renderCommunity(): TemplateResult {
    const list = this._community;
    const when = (ms: number): string => new Date(ms).toLocaleString(this.hass?.locale?.language);
    const status = html`
      ${this._communityError ? html`<ha-alert alert-type="warning">${this._communityError}</ha-alert>` : html``}
      ${
        this._communityError && list
          ? html`<p class="hint">
              ${localize('share.community_showing_cached', { time: when(list.fetched) }, this.hass)}
            </p>`
          : html``
      }
    `;

    if (!list) {
      return html`
        <div class="library">
          ${status}
          <ha-button .disabled=${this._communityLoading} @click=${(): void => void this._loadCommunity(false)}>
            ${localize(this._communityLoading ? 'share.community_loading' : 'share.community_load', undefined, this.hass)}
          </ha-button>
        </div>
      `;
    }

    const existing = this._communityExisting();
    const entry = list.entries.find((each) => each.id === this._communitySelected);
    const key = entry ? `community:${entry.id}` : '';
    const armed = !!entry && this._installPending === key;
    const installAs = entry && existing.includes(entry.name) ? freeName(entry.name, existing) : undefined;
    const needs = entry ? communityNeeds(entry, existing) : undefined;
    const brings = entry ? Object.keys(entry.includes).filter((each) => !existing.includes(each)) : [];
    const risks = entry ? communityRisks(entry) : undefined;
    // Installing needs every name this dashboard can see, and the other dashboards' names
    // arrive after the list. Until they have, nothing is installed; if they never will,
    // nothing is installed either, and the alert says why.
    const namesReady = this._communityKnown !== undefined;

    return html`
      <div class="library">
        ${status}
        ${
          list.entries.length
            ? html`<ha-form
                .hass=${this.hass}
                .data=${{ entry: entry ? String(entry.id) : '' }}
                .schema=${[
                  {
                    name: 'entry',
                    selector: {
                      select: {
                        mode: 'dropdown',
                        options: list.entries.map((each) => ({
                          value: String(each.id),
                          label: localize('share.community_by', { title: each.title, author: each.author }, this.hass),
                        })),
                      },
                    },
                  },
                ]}
                .computeLabel=${(): string => localize('share.community_pick', undefined, this.hass)}
                @value-changed=${this._communityPicked}
              ></ha-form>`
            : html`<p class="hint">${localize('share.community_none', undefined, this.hass)}</p>`
        }
        ${
          entry && needs
            ? html`
                <p class="hint">
                  ${typeof entry.template.description === 'string' ? entry.template.description : ''}
                  <a href=${entry.url} target="_blank" rel="noopener noreferrer"
                    >${localize('share.community_open', undefined, this.hass)}</a
                  >
                </p>
                ${
                  brings.length
                    ? html`<p class="hint">
                        ${localize('share.library_needs', { names: brings.join(', ') }, this.hass)}
                      </p>`
                    : html``
                }
                ${
                  /*
                   * Only the custom cards this browser does not have: the ones it has need
                   * nothing doing, and a second alert listing every custom card the post uses
                   * said the same thing as this one about the missing ones.
                   */
                  this._renderMissingCards([entry.template, ...Object.values(entry.includes)])
                }
                ${
                  needs.templates.length
                    ? html`<ha-alert alert-type="warning">
                        ${localize('share.community_needs_templates', { names: needs.templates.join(', ') }, this.hass)}
                      </ha-alert>`
                    : html``
                }
                ${risks && anyRisk(risks) ? this._renderRisks(risks, 'share.community_risks') : html``}
                <ha-expansion-panel outlined expanded>
                  <span slot="header">${localize('share.library_preview', undefined, this.hass)}</span>
                  ${keyed(
                    entry.id,
                    html`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${{
                        template: entry.name,
                        ...entry.template,
                        ...(Object.keys(entry.includes).length ? { includes: entry.includes } : {}),
                      }}
                      read-only
                    ></ha-yaml-editor>`,
                  )}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{ where: this._libraryDestination }}
                  .schema=${[
                    {
                      name: 'where',
                      selector: {
                        select: {
                          mode: 'dropdown',
                          options: [
                            { value: 'view', label: localize('share.library_where_view', undefined, this.hass) },
                            { value: 'root', label: localize('share.library_where_root', undefined, this.hass) },
                          ],
                        },
                      },
                    },
                  ]}
                  .computeLabel=${(): string => localize('share.library_where', undefined, this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                ${
                  this._communityKnownFailed
                    ? html`<ha-alert alert-type="error">
                        ${localize('share.community_names_failed', undefined, this.hass)}
                      </ha-alert>`
                    : html``
                }
                <ha-button .disabled=${this._busy || !namesReady} @click=${(): void => void this._installShared(entry)}>
                  ${
                    !namesReady && !this._communityKnownFailed
                      ? localize('share.community_names_loading', undefined, this.hass)
                      : armed
                        ? localize('share.install_anyway', undefined, this.hass)
                        : installAs
                          ? localize('share.community_install_as', { name: installAs }, this.hass)
                          : localize('share.install', undefined, this.hass)
                  }
                </ha-button>
              `
            : html``
        }
        <ha-button .disabled=${this._communityLoading} @click=${(): void => void this._loadCommunity(true)}>
          ${localize(this._communityLoading ? 'share.community_loading' : 'share.community_refresh', undefined, this.hass)}
        </ha-button>
      </div>
    `;
  }

  /*
   * What a template nobody here has checked would be allowed to do, under a heading that
   * says what is about to happen to it - install, import or update - so the same list reads
   * right wherever it appears.
   */
  private _renderRisks(risks: CommunityRisks, title: string): TemplateResult {
    return html`<ha-alert alert-type="warning" .title=${localize(title, undefined, this.hass)}>
      <ul class="risks">
        ${
          risks.actions.length
            ? html`<li>${localize('share.community_risk_actions', { list: risks.actions.join(', ') }, this.hass)}</li>`
            : html``
        }
        ${
          risks.urls.length
            ? html`<li>${localize('share.community_risk_urls', { list: risks.urls.join(', ') }, this.hass)}</li>`
            : html``
        }
        ${risks.embeds ? html`<li>${localize('share.community_risk_embeds', undefined, this.hass)}</li>` : html``}
        ${risks.scripts ? html`<li>${localize('share.community_risk_scripts', undefined, this.hass)}</li>` : html``}
        ${
          risks.placeholders
            ? html`<li>${localize('share.community_risk_placeholders', undefined, this.hass)}</li>`
            : html``
        }
      </ul>
    </ha-alert>`;
  }

  private async _loadCommunity(refresh: boolean): Promise<void> {
    this._communityLoading = true;
    this._communityError = undefined;
    // The names are read again with the list, so a dashboard lent a template since is seen.
    this._communityKnown = undefined;
    this._communityKnownFailed = false;
    try {
      this._community = await fetchCommunity({ refresh });
    } catch (err) {
      const error = err as CommunityError;
      if (error.cached) this._community = error.cached;
      this._communityError = error.retryAt
        ? localize(
            'share.community_rate_limited',
            { time: new Date(error.retryAt).toLocaleTimeString(this.hass?.locale?.language) },
            this.hass,
          )
        : localize('share.community_failed', { message: error.message }, this.hass);
    } finally {
      this._communityLoading = false;
    }
    // A cached list shown after a failed fetch can be installed from too, so it needs the names as much.
    if (this._community) void this._loadCommunityKnown();
  }

  /** This dashboard's templates and the ones it borrows, by name - the borrowed ones once they have been read. */
  private _communityExisting(): string[] {
    const local = Object.keys(collectTemplates(this._savedLovelace));
    return [...new Set([...local, ...(this._communityKnown ?? [])])];
  }

  private async _loadCommunityKnown(): Promise<void> {
    try {
      const all = await collectAllTemplates(this.hass, this._savedLovelace);
      this._communityKnown = Object.keys(all);
    } catch {
      // A dashboard that cannot be read leaves the clash check with half an answer, and an
      // install on half an answer can take over a template it never saw. So no install.
      this._communityKnownFailed = true;
    }
  }

  private _communityPicked(ev: CustomEvent): void {
    // Not part of the card's configuration, so it must not reach the settings handler.
    ev.stopPropagation();
    const picked = Number((ev.detail.value as { entry?: string }).entry);
    this._communitySelected = Number.isFinite(picked) && picked > 0 ? picked : undefined;
    this._installPending = undefined;
  }

  /*
   * Installs a shared template the way the library installs one, asked twice. A name this
   * dashboard already uses is not overwritten: the template goes in under the first free
   * spelling instead. Templates it carries go in beside it unless they are already here.
   */
  private async _installShared(entry: CommunityEntry): Promise<void> {
    // The button is off until the names are in, but a press is checked here as well.
    if (this._communityKnown === undefined) return;
    const key = `community:${entry.id}`;
    if (this._installPending !== key) {
      this._installPending = key;
      this._installArmedAt = Date.now();
      return;
    }
    if (Date.now() - this._installArmedAt < SECOND_PRESS_MS) return;

    const panel = getLovelacePanel();
    const existing = this._communityExisting();
    const name = existing.includes(entry.name) ? freeName(entry.name, existing) : entry.name;
    /*
     * Each one is stamped with the post it came from and when that post was last edited,
     * so the Share tab can offer a newer version later. The name it has in the post is kept
     * too: it is not always the name it goes in under, and a post can carry several.
     */
    const wanted: [string, Record<string, unknown>][] = [
      ...Object.entries(entry.includes)
        .filter(([each]) => !existing.includes(each))
        .map(([each, template]): [string, Record<string, unknown>] => [
          each,
          stampedTemplate(template, communitySource(entry, each)),
        ]),
      [name, stampedTemplate(entry.template, communitySource(entry, entry.name))],
    ];
    const here = findTemplateLocation(panel?.config ?? this.lovelace, this._config?.template ?? '');
    const view = here?.view?.index ?? 0;

    const saved = await this._saveDashboard(
      (config) =>
        wanted.reduce(
          (built, [each, template]) =>
            this._libraryDestination === 'root'
              ? addTemplateToRoot(built, each, template as TemplateConfig)
              : // Name and type lead, as on any template card, and nothing in the post overrides them.
                addCardToView(
                  built,
                  view,
                  Object.assign({ type: TEMPLATE_TYPE, template: each }, template, {
                    type: TEMPLATE_TYPE,
                    template: each,
                  }),
                ),
          config,
        ),
      'community_install',
    );
    if (saved) this._installPending = undefined;
  }

  /*
   * The custom cards a template needs that this browser does not have. Said before the
   * install rather than after, and never in the way of it: installing the template may be
   * the first step of setting the card up.
   */
  private _renderMissingCards(templates: unknown[]): TemplateResult {
    const missing = missingCustomCards(
      templates.filter((each) => each !== undefined),
      isDefinedHere,
    );
    if (!missing.length) return html``;
    return html`<ha-alert alert-type="warning">
      ${localize(
        missing.length === 1 ? 'share.missing_card_one' : 'share.missing_card_many',
        { cards: missing.join(', ') },
        this.hass,
      )}
    </ha-alert>`;
  }

  /*
   * Templates installed from the shared list, and whether their posts have changed since.
   * Only the button asks GitHub, as with loading the list: a dashboard never reaches the
   * internet just because somebody opened this tab.
   */
  private _renderInstalled(): TemplateResult {
    const installed = installedFromShared(this._savedLovelace);
    if (!installed.length) return html``;
    const found = new Map((this._updates ?? []).map((each) => [each.name, each]));
    return html`
      <h3>${localize('share.installed_header', undefined, this.hass)}</h3>
      <p class="hint">${localize('share.installed_hint', undefined, this.hass)}</p>
      ${this._updatesError ? html`<ha-alert alert-type="warning">${this._updatesError}</ha-alert>` : html``}
      <ul class="installed">
        ${installed.map(({ name, source, template }) => {
          const update = found.get(name);
          return html`<li>
            ${name} —
            <a
              href=${update?.entry?.url ?? `https://github.com/${COMMUNITY_REPO}/discussions/${source.discussion}`}
              target="_blank"
              rel="noopener noreferrer"
              >${localize('share.installed_from', { discussion: source.discussion }, this.hass)}</a
            >
            ${
              update
                ? html`<span class="status"
                    >${localize(`share.installed_status_${update.status}`, undefined, this.hass)}</span
                  >`
                : html``
            }
            ${update?.status === 'update' && update.latest ? this._renderUpdate(name, template, update) : html``}
          </li>`;
        })}
      </ul>
      <ha-button .disabled=${this._updatesLoading} @click=${(): void => void this._checkUpdates()}>
        ${localize(this._updatesLoading ? 'share.community_loading' : 'share.installed_check', undefined, this.hass)}
      </ha-button>
    `;
  }

  /*
   * What updating would change, before it does. The two versions are shown one above the
   * other for now; a line-by-line comparison would read better, and is the thing to swap
   * in here once there is one.
   *
   * The post's new version is as unchecked as the post was, and an edit is exactly where a
   * tile labelled "Lights" grows a lock service. So it gets the same risk scan an install
   * does - narrowed to what is new against the installed copy, since that is what the person
   * has not already said yes to, and the whole list when nothing is new but something is there.
   */
  private _renderUpdate(name: string, installed: TemplateConfig, update: SharedUpdate): TemplateResult {
    const latest = update.latest as Record<string, unknown>;
    // Where it came from is bookkeeping, and differs by definition - it is not what changed.
    const bare = (template: Record<string, unknown>): Record<string, unknown> => {
      const copy = { ...template };
      delete copy.source;
      delete copy.type;
      delete copy.template;
      return copy;
    };
    const was = bare(installed as Record<string, unknown>);
    const now = bare(latest);
    const risks = communityRisks({ template: now, includes: {} });
    const added = newRisks(risks, communityRisks({ template: was, includes: {} }));
    const armed = this._updatePending === name;
    return html`
      <p class="hint">${localize('share.installed_compare', undefined, this.hass)}</p>
      ${renderDiffWithFull(was, now, this.hass)} ${this._renderMissingCards([latest])}
      ${
        anyRisk(added)
          ? this._renderRisks(added, 'share.installed_risks_new')
          : anyRisk(risks)
            ? this._renderRisks(risks, 'share.installed_risks')
            : html``
      }
      ${
        armed
          ? html`<ha-alert alert-type="warning">
              ${localize('share.installed_update_confirm', { name }, this.hass)}
            </ha-alert>`
          : html``
      }
      <ha-button .disabled=${this._busy} @click=${(): void => void this._updateShared(name, latest)}>
        ${localize(armed ? 'share.installed_update_anyway' : 'share.installed_update', undefined, this.hass)}
      </ha-button>
    `;
  }

  private async _checkUpdates(): Promise<void> {
    this._updatesLoading = true;
    this._updatesError = undefined;
    this._updatePending = undefined;
    const installed = installedFromShared(this._savedLovelace);
    try {
      // Fresh, not from the cache: the question is whether anything changed since.
      this._updates = sharedUpdates(installed, await fetchCommunity({ refresh: true }));
    } catch (err) {
      const error = err as CommunityError;
      this._updatesError = error.retryAt
        ? localize(
            'share.community_rate_limited',
            { time: new Date(error.retryAt).toLocaleTimeString(this.hass?.locale?.language) },
            this.hass,
          )
        : localize('share.community_failed', { message: error.message }, this.hass);
    } finally {
      this._updatesLoading = false;
    }
  }

  /*
   * Replaces the installed template with the post's, wherever it is defined, asked twice.
   * The cards using it still name it and are not touched; what is lost is any change made
   * to this copy of the template since it was installed, which the confirmation says.
   */
  private async _updateShared(name: string, latest: Record<string, unknown>): Promise<void> {
    if (this._updatePending !== name) {
      this._updatePending = name;
      this._updateArmedAt = Date.now();
      return;
    }
    if (Date.now() - this._updateArmedAt < SECOND_PRESS_MS) return;
    const saved = await this._saveDashboard((config) => replaceTemplate(config, name, latest), 'shared_update');
    if (!saved) return;
    this._updatePending = undefined;
    this._updates = this._updates?.map((each) => (each.name === name ? { ...each, status: 'current' } : each));
    // The dialog may be open on this very template, and saving it would put the old one back.
    if (this._config?.template === name) {
      this._fireConfigChanged({ ...latest, type: this._config.type, template: name } as DeclutteringTemplateConfig);
    }
  }

  /*
   * The hard part of this card has never been the syntax - it is the blank page. These are
   * carried in the bundle rather than fetched, so a dashboard never has to reach the
   * internet to show one, and nobody has to think about what it is talking to.
   */
  private _renderLibrary(): TemplateResult {
    const existing = Object.keys(collectTemplates(this._savedLovelace));
    const entry = this._librarySelected ? libraryEntry(this._librarySelected) : undefined;
    const already = !!entry && existing.includes(entry.name);
    const armed = !!entry && this._installPending === entry.name;
    const needs = entry ? libraryNeeds(entry, existing) : [];

    return html`
      <div class="library">
        <ha-form
          .hass=${this.hass}
          .data=${{ entry: this._librarySelected ?? '' }}
          .schema=${[
            {
              name: 'entry',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: LIBRARY.map((each) => ({ value: each.name, label: each.name })),
                },
              },
            },
          ]}
          .computeLabel=${(): string => localize('share.library_pick', undefined, this.hass)}
          @value-changed=${this._libraryPicked}
        ></ha-form>
        ${
          entry
            ? html`
                <p class="hint">${localize(`library.${entry.name}.summary`, undefined, this.hass)}</p>
                ${
                  needs.length
                    ? html`<p class="hint">
                        ${localize('share.library_needs', { names: needs.join(', ') }, this.hass)}
                      </p>`
                    : html``
                }
                ${this._renderMissingCards(
                  [entry, ...needs.map((each) => libraryEntry(each))].map((each) => each?.template),
                )}
                <ha-expansion-panel outlined>
                  <span slot="header">${localize('share.library_preview', undefined, this.hass)}</span>
                  ${keyed(
                    entry.name,
                    // ha-yaml-editor reads defaultValue once, so a new entry needs a new box.
                    html`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${entry.template}
                      read-only
                    ></ha-yaml-editor>`,
                  )}
                </ha-expansion-panel>
                <ha-form
                  .hass=${this.hass}
                  .data=${{ where: this._libraryDestination }}
                  .schema=${[
                    {
                      name: 'where',
                      selector: {
                        select: {
                          mode: 'dropdown',
                          options: [
                            { value: 'view', label: localize('share.library_where_view', undefined, this.hass) },
                            { value: 'root', label: localize('share.library_where_root', undefined, this.hass) },
                          ],
                        },
                      },
                    },
                  ]}
                  .computeLabel=${(): string => localize('share.library_where', undefined, this.hass)}
                  @value-changed=${this._libraryDestinationPicked}
                ></ha-form>
                <ha-button .disabled=${this._busy || already} @click=${(): void => void this._install(entry.name)}>
                  ${localize(
                    already ? 'share.already_here' : armed ? 'share.install_anyway' : 'share.install',
                    undefined,
                    this.hass,
                  )}
                </ha-button>
              `
            : html``
        }
      </div>
    `;
  }

  private _libraryDestinationPicked(ev: CustomEvent): void {
    ev.stopPropagation();
    const where = (ev.detail.value as { where?: string }).where;
    this._libraryDestination = where === 'root' ? 'root' : 'view';
  }

  private _libraryPicked(ev: CustomEvent): void {
    // The template editor's own settings form also listens for value-changed; this one is
    // not part of the card's configuration, so it must not reach that handler. Switching
    // entries also disarms a half-confirmed install of the previous one.
    ev.stopPropagation();
    this._librarySelected = (ev.detail.value as { entry?: string }).entry || undefined;
    this._installPending = undefined;
  }

  private async _install(name: string): Promise<void> {
    const entry = libraryEntry(name);
    if (!entry) return;
    if (this._installPending !== name) {
      this._installPending = name;
      return;
    }

    const panel = getLovelacePanel();
    const existing = Object.keys(collectTemplates(panel?.config ?? this._savedLovelace));
    // What it calls comes with it, or the card it adds would point at a name that is not
    // there. Anything already on the dashboard is left exactly as it is.
    const wanted = [...libraryNeeds(entry, existing), entry.name].filter((each) => !existing.includes(each));
    const here = findTemplateLocation(panel?.config ?? this.lovelace, this._config?.template ?? '');
    const view = here?.view?.index ?? 0;

    const saved = await this._saveDashboard(
      (config) =>
        wanted.reduce((built, each) => {
          const one = libraryEntry(each);
          if (!one) return built;
          // Where it lands is the user's choice: a template card on this view, which is
          // visible and editable in place, or the dashboard's decluttering_templates block,
          // which keeps the view clean.
          // Stamped with the entry and this card's version, so it is known where it came from.
          const stamped = { ...one.template, source: librarySource(one.name, VERSION) };
          return this._libraryDestination === 'root'
            ? addTemplateToRoot(built, one.name, stamped as TemplateConfig)
            : addCardToView(built, view, { type: TEMPLATE_TYPE, template: one.name, ...stamped });
        }, config),
      'library_install',
    );
    if (saved) this._installPending = undefined;
  }

  /*
   * Renaming is the one edit a template card cannot make on its own: every card naming the
   * old template would break the moment the new name was saved. So it is done here, across
   * the whole dashboard at once, rather than by editing the name field above.
   */
  private _renderRename(name: string, total: number): TemplateResult {
    const to = this._renameTo.trim();
    const armed = !!to && this._renamePending === to;
    const rewrites = total
      ? total === 1
        ? localize('tools.rewrites_one', undefined, this.hass)
        : localize('tools.rewrites_many', { count: total }, this.hass)
      : '';
    return html`
      <div class="rename">
        <h3>${localize('tools.rename_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('tools.rename_hint', undefined, this.hass)}</p>
        ${this._renameError ? html`<ha-alert alert-type="error">${this._renameError}</ha-alert>` : html``}
        ${
          armed
            ? html`<ha-alert alert-type="warning">
                ${localize('tools.rename_confirm', { from: name, to, rewrites }, this.hass)}
              </ha-alert>`
            : html``
        }
        ${textField({
          label: localize('tools.new_name', undefined, this.hass),
          value: this._renameTo,
          disabled: this._renaming,
          onInput: (value) => this._renameChanged(value),
        })}
        <ha-button .disabled=${this._renaming || !to || to === name} @click=${this._rename}>
          ${
            armed
              ? localize('tools.rename_anyway', undefined, this.hass)
              : total === 1
                ? localize('tools.rename_update_one', undefined, this.hass)
                : total
                  ? localize('tools.rename_update_many', { count: total }, this.hass)
                  : localize('tools.rename', undefined, this.hass)
          }
        </ha-button>
      </div>
    `;
  }

  /**
   * Saves a rewritten dashboard, and says what went wrong if it cannot. Everything here
   * changes cards this editor does not own, so it goes through the dashboard itself rather
   * than through config-changed.
   */
  private async _saveDashboard(
    build: (config: unknown) => unknown,
    operation: string,
    dialog?: unknown,
  ): Promise<boolean> {
    const panel = getLovelacePanel();
    if (!panel) {
      this._toolError = localize('tools.cannot_save_here', undefined, this.hass);
      return false;
    }
    this._busy = true;
    this._toolError = undefined;
    try {
      // Through the one place every rewrite goes, so it can be undone.
      await rewriteDashboards(this, this.hass, operation, [{ urlPath: pageDashboard(), build }], dialog);
      this._undoChanged = undefined;
      return true;
    } catch (err) {
      this._toolError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
      return false;
    } finally {
      this._busy = false;
    }
  }

  /*
   * Installing this card over the original needs no changes - it answers to both sets of
   * names. But a dashboard still saying `custom:decluttering-card` everywhere breaks the
   * day the original is installed alongside it, because Home Assistant loads resources in
   * the order they were added and the original would win.
   */
  private _renderModernise(): TemplateResult {
    const ll = this._savedLovelace;
    const old = ll ? countLegacyTypes(ll) : 0;
    if (!old) return html``;

    return html`
      <div class="rename">
        <h3>${localize('tools.modernise_header', undefined, this.hass)}</h3>
        <p class="hint">
          ${localize(old === 1 ? 'tools.modernise_hint_one' : 'tools.modernise_hint_many', { count: old }, this.hass)}
        </p>
        ${
          this._modernisePending
            ? html`<ha-alert alert-type="warning">
                ${localize(
                  old === 1 ? 'tools.modernise_confirm_one' : 'tools.modernise_confirm_many',
                  { count: old },
                  this.hass,
                )}
              </ha-alert>`
            : html``
        }
        <ha-button .disabled=${this._busy} @click=${this._modernise}>
          ${localize(
            this._modernisePending
              ? 'tools.modernise_anyway'
              : old === 1
                ? 'tools.modernise_one'
                : 'tools.modernise_many',
            undefined,
            this.hass,
          )}
        </ha-button>
      </div>
    `;
  }

  private async _modernise(): Promise<void> {
    if (!this._modernisePending) {
      this._modernisePending = true;
      return;
    }
    const saved = await this._saveDashboard((config) => moderniseTypes(config), 'modernise');
    if (saved) this._modernisePending = false;
  }

  private _renameChanged(value: string): void {
    this._renameTo = value;
    this._renameError = undefined;
    // Whatever was agreed to was agreed to for the old name, not this one.
    this._renamePending = undefined;
  }

  private async _rename(): Promise<void> {
    const from = this._config?.template;
    const to = this._renameTo.trim();
    if (!from || !to || to === from) return;

    // The dashboard object, not its configuration: renaming rewrites cards this editor
    // does not own, so it has to be saved as a whole rather than through config-changed.
    const panel = getLovelacePanel();
    if (!panel) {
      this._renameError = localize('tools.cannot_rename_here', undefined, this.hass);
      return;
    }
    if (collectTemplates(panel.config)[to] !== undefined) {
      this._renameError = localize('tools.name_taken', { name: to }, this.hass);
      return;
    }

    if (this._renamePending !== to) {
      this._renamePending = to;
      return;
    }

    this._renaming = true;
    this._renameError = undefined;
    try {
      await rewriteDashboards(
        this,
        this.hass,
        'rename_template',
        [{ urlPath: pageDashboard(), build: (config) => renameTemplate(config, from, to) }],
        this._config,
      );
      this._undoChanged = undefined;
      // The dialog still holds this card under its old name, and saving it afterwards
      // would put that name straight back - so it is told about the change too.
      this._fireConfigChanged({ ...this._config, template: to } as DeclutteringTemplateConfig);
      this._renameTo = '';
      this._renamePending = undefined;
    } catch (err) {
      this._renameError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
    } finally {
      this._renaming = false;
    }
  }

  /*
   * Where a value is used - `light.kitchen` after the bulb is replaced - when the cards that
   * show it are templated: the entity is a variable on some card on some dashboard, or
   * written straight into a template, and Home Assistant's own search looks at neither.
   * Every dashboard is read fresh when the button is pressed, and only then.
   */
  private _renderSearch(): TemplateResult {
    const query = this._searchQuery.trim();
    const result = this._searchResult;
    const where = (match: CardValueMatch): string =>
      match.where === 'variables' ? '' : localize(`tools.search_in_${match.where}`, undefined, this.hass);
    const view = (match: CardValueMatch): string =>
      match.view.title || match.view.path || localize('template_editor.untitled_view', undefined, this.hass);
    return html`
      <div class="rename">
        <h3>${localize('tools.search_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('tools.search_hint', undefined, this.hass)}</p>
        ${textField({
          label: localize('tools.search_label', undefined, this.hass),
          value: this._searchQuery,
          onInput: (value) => {
            this._searchQuery = value;
          },
          onKeydown: (ev) => {
            if (ev.key === 'Enter') void this._search();
          },
        })}
        <ha-button .disabled=${this._searching || !query} @click=${(): void => void this._search()}>
          ${localize(this._searching ? 'tools.searching' : 'tools.search', undefined, this.hass)}
        </ha-button>
        ${
          result && !result.cards.length && !result.templates.length
            ? html`<p class="hint">${localize('tools.search_none', { query: result.query }, this.hass)}</p>`
            : html``
        }
        ${
          result?.cards.length
            ? html`
                <p class="hint">${localize('tools.search_cards', { count: result.cards.length }, this.hass)}</p>
                <ul>
                  ${result.cards.slice(0, SEARCH_SHOWN).map(
                    (match) => html`
                      <li>
                        <a
                          href=${`/${match.urlPath}/${match.view.path || match.view.index}`}
                          target="_blank"
                          rel="noreferrer"
                          >${match.urlPath} › ${view(match)}</a
                        >
                        — ${match.template}: <code>${match.variable}</code> = ${match.value}${where(match)}
                      </li>
                    `,
                  )}
                </ul>
                ${
                  result.cards.length > SEARCH_SHOWN
                    ? html`<p class="hint">
                        ${localize('editor.matches_more', { count: result.cards.length - SEARCH_SHOWN }, this.hass)}
                      </p>`
                    : html``
                }
              `
            : html``
        }
        ${
          result?.templates.length
            ? html`
                <p class="hint">${localize('tools.search_templates', { count: result.templates.length }, this.hass)}</p>
                <ul>
                  ${result.templates
                    .slice(0, SEARCH_SHOWN)
                    .map(
                      (match) =>
                        html`<li>
                          ${match.urlPath} › ${match.template}: <code>${match.path}</code> = ${match.value}
                        </li>`,
                    )}
                </ul>
                ${
                  result.templates.length > SEARCH_SHOWN
                    ? html`<p class="hint">
                        ${localize('editor.matches_more', { count: result.templates.length - SEARCH_SHOWN }, this.hass)}
                      </p>`
                    : html``
                }
              `
            : html``
        }
      </div>
    `;
  }

  private async _search(): Promise<void> {
    const query = this._searchQuery.trim();
    if (!query || this._searching) return;
    this._searching = true;
    try {
      const own = pageDashboard();
      const saver = saverFor(this.hass);
      const dashboards: { urlPath: string; config: unknown }[] = [{ urlPath: own, config: this._savedLovelace }];
      for (const path of this.hass ? await fetchDashboardPaths(this.hass) : []) {
        if (dashboardKey(path) === own) continue;
        try {
          dashboards.push({ urlPath: path, config: await readDashboard(saver, path) });
        } catch {
          // A dashboard that cannot be read has nothing to say here.
        }
      }
      this._searchResult = { query, ...searchValues(dashboards, query) };
    } finally {
      this._searching = false;
    }
  }

  /*
   * A variable's name is written in the template and in every card that passes it, so
   * changing it in the template alone leaves the cards passing a value nothing reads - which
   * renders as the template's default and looks almost right. This changes it everywhere at
   * once: the template, templates built on it, cards using either, on this dashboard and on
   * any other that borrows this template. The first press counts, the second saves.
   */
  private _renderRenameVariable(name: string): TemplateResult {
    const names = variableNames(this._config);
    if (!names.length || !this._config) return html``;
    const from = this._varFrom && names.includes(this._varFrom) ? this._varFrom : undefined;
    const to = this._varTo.trim();
    const pending = this._varPending;
    const armed = !!pending && pending.from === from && pending.to === to;
    const elsewhere =
      armed && pending.elsewhere.length
        ? localize(
            'tools.rename_variable_elsewhere',
            { list: pending.elsewhere.map((each) => `${each.urlPath} (${each.cards})`).join(', ') },
            this.hass,
          )
        : '';
    return html`
      <div class="rename">
        <h3>${localize('tools.rename_variable_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('tools.rename_variable_hint', undefined, this.hass)}</p>
        ${this._varError ? html`<ha-alert alert-type="error">${this._varError}</ha-alert>` : html``}
        ${
          armed && from
            ? html`
                <ha-alert alert-type="warning">
                  ${localize(
                    'tools.rename_variable_confirm',
                    { from, to, templates: pending.templates, cards: pending.cards, elsewhere },
                    this.hass,
                  )}
                </ha-alert>
                ${renderDiff(this._config, renameVariableInTemplate(this._config, from, to), this.hass)}
              `
            : html``
        }
        <ha-form
          .hass=${this.hass}
          .data=${{ variable: from ?? '' }}
          .schema=${[
            {
              name: 'variable',
              selector: { select: { mode: 'dropdown', options: names.map((each) => ({ value: each, label: each })) } },
            },
          ]}
          .computeLabel=${(): string => localize('tools.rename_variable_pick', undefined, this.hass)}
          @value-changed=${this._varPicked}
        ></ha-form>
        ${textField({
          label: localize('tools.new_name', undefined, this.hass),
          value: this._varTo,
          disabled: this._busy,
          onInput: (value) => this._varToChanged(value),
        })}
        <ha-button
          .disabled=${this._busy || !from || !to || to === from}
          @click=${(): void => void this._renameVariable(name)}
        >
          ${localize(armed ? 'tools.rename_anyway' : 'tools.rename_variable', undefined, this.hass)}
        </ha-button>
      </div>
    `;
  }

  private _varPicked(ev: CustomEvent): void {
    // Not part of the card's configuration, so it must not reach the settings handler.
    ev.stopPropagation();
    this._varFrom = (ev.detail.value as { variable?: string }).variable || undefined;
    this._varError = undefined;
    this._varPending = undefined;
  }

  private _varToChanged(value: string): void {
    this._varTo = value;
    this._varError = undefined;
    // Whatever was counted was counted for the old name, not this one.
    this._varPending = undefined;
  }

  private async _renameVariable(name: string): Promise<void> {
    const from = this._varFrom;
    const to = this._varTo.trim();
    if (!from || !to || to === from || !this._config) return;
    if (!validVariableName(to)) {
      this._varError = localize('tools.rename_variable_invalid', { name: to }, this.hass);
      return;
    }
    const panel = getLovelacePanel();
    if (!panel) {
      this._varError = localize('tools.cannot_save_here', undefined, this.hass);
      return;
    }
    if (nameTakenIn(panel.config, name, to, this._config)) {
      this._varError = localize('tools.rename_variable_taken', { name: to }, this.hass);
      return;
    }

    const own = pageDashboard();
    const pending = this._varPending;
    if (!pending || pending.from !== from || pending.to !== to) {
      // The first press counts what the second would rewrite. Other dashboards are read
      // fresh: a borrowed template's cards can be anywhere, and a cached copy may be stale.
      this._busy = true;
      try {
        const saver = saverFor(this.hass);
        const current = await readDashboard(saver, own).catch(() => panel.config);
        const here = renameVariableInDashboard(current, name, from, to);
        // The templates built on this one are borrowed along with it, and so are their cards.
        const lent = affectedTemplates(current, name);
        const elsewhere: { urlPath: string; cards: number }[] = [];
        for (const path of this.hass ? await fetchDashboardPaths(this.hass) : []) {
          if (dashboardKey(path) === own) continue;
          let config: unknown;
          try {
            config = await readDashboard(saver, path);
          } catch {
            // A dashboard that cannot be read - a YAML one, one being deleted - is not rewritten either.
            continue;
          }
          if (!borrowsTemplate(config, name, own)) continue;
          const there = renameVariableInDashboard(config, name, from, to, lent);
          if (there.cards || there.templates) elsewhere.push({ urlPath: path, cards: there.cards });
        }
        this._varPending = { from, to, cards: here.cards, templates: here.templates, elsewhere };
      } finally {
        this._busy = false;
      }
      return;
    }

    this._busy = true;
    this._varError = undefined;
    try {
      // Worked out again from this dashboard as it is read for saving, which comes first.
      let lent: Set<string> | undefined;
      await rewriteDashboards(
        this,
        this.hass,
        'rename_variable',
        [
          {
            urlPath: own,
            build: (config: unknown): unknown => {
              lent = affectedTemplates(config, name);
              return renameVariableInDashboard(config, name, from, to).config;
            },
          },
          // Checked again as each is saved: it is read fresh, and may have stopped borrowing.
          ...pending.elsewhere.map((each) => ({
            urlPath: each.urlPath,
            build: (config: unknown): unknown =>
              borrowsTemplate(config, name, own)
                ? renameVariableInDashboard(config, name, from, to, lent).config
                : config,
          })),
        ],
        this._config,
      );
      this._undoChanged = undefined;
      // The dialog holds this template too, and saving it afterwards would put the old name back.
      this._fireConfigChanged(renameVariableInTemplate(this._config, from, to));
      this._varFrom = to;
      this._varTo = '';
      this._varPending = undefined;
    } catch (err) {
      this._varError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
    } finally {
      this._busy = false;
    }
  }

  /*
   * Most new templates start life as a variant of one that exists. There was no way to make
   * one but to export it from the Share tab, paste it back, and rename it by hand.
   */
  private _renderDuplicate(name: string): TemplateResult {
    const to = this._duplicateTo.trim();
    const armed = !!to && this._duplicatePending === to;
    return html`
      <div class="rename">
        <h3>${localize('tools.duplicate_header', undefined, this.hass)}</h3>
        <p class="hint">${localize('tools.duplicate_hint', undefined, this.hass)}</p>
        ${
          armed
            ? html`<ha-alert alert-type="warning">
                ${localize('tools.duplicate_confirm', { to, name }, this.hass)}
              </ha-alert>`
            : html``
        }
        ${textField({
          label: localize('tools.copy_name', undefined, this.hass),
          value: this._duplicateTo,
          disabled: this._busy,
          onInput: (value) => this._duplicateChanged(value),
        })}
        <ha-button .disabled=${this._busy || !to || to === name} @click=${this._duplicate}>
          ${localize(armed ? 'tools.duplicate_anyway' : 'tools.duplicate', undefined, this.hass)}
        </ha-button>
      </div>
    `;
  }

  private _duplicateChanged(value: string): void {
    this._duplicateTo = value;
    this._toolError = undefined;
    this._duplicatePending = undefined;
  }

  private async _duplicate(): Promise<void> {
    const from = this._config?.template;
    const to = this._duplicateTo.trim();
    if (!from || !to || to === from) return;

    const panel = getLovelacePanel();
    if (panel && collectTemplates(panel.config)[to] !== undefined) {
      this._toolError = localize('tools.name_taken', { name: to }, this.hass);
      return;
    }
    if (this._duplicatePending !== to) {
      this._duplicatePending = to;
      return;
    }

    const copy = { ...(this._config as DeclutteringTemplateConfig), template: to };
    // Beside the one being copied, which is where somebody would look for it.
    const here = findTemplateLocation(panel?.config ?? this.lovelace, from);
    const saved = await this._saveDashboard(
      (config) => addCardToView(config, here?.view?.index ?? 0, copy),
      'duplicate',
    );
    if (saved) {
      this._duplicateTo = '';
      this._duplicatePending = undefined;
    }
  }

  private async _copyExport(): Promise<void> {
    const editor = this.renderRoot.querySelector('#export');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yaml = (editor as any)?.yaml;
    if (!yaml) return;

    const { notes } = buildExport(this._config);
    // The notes ride along as comments, so they are still there when the text is pasted
    // somewhere that cannot show them. YAML ignores them on the way back in.
    const text = [...notes.map((note) => `# ${note}`), yaml].join('\n');

    this._copyState = (await copyText(text)) ? 'done' : 'failed';
    setTimeout(() => (this._copyState = ''), 3000);
  }

  /*
   * The same export, written as a GitHub discussion post: what it is, what it needs, and
   * the YAML in a code block - which is exactly what the shared-templates list reads back.
   */
  private async _copyPost(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const yaml = (this.renderRoot.querySelector('#export') as any)?.yaml;
    if (!yaml) return;
    const { notes } = buildExport(this._config, collectTemplates(this._savedLovelace));
    this._postCopyState = (await copyText(postBody(yaml, notes, this._config?.description))) ? 'done' : 'failed';
    setTimeout(() => (this._postCopyState = ''), 3000);
  }

  private _importChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    this._importValue = ev.detail.value;
    this._importParses = ev.detail.isValid !== false;
    this._importErrors = [];
    this._importClash = undefined;
    this._importRisks = undefined;
  }

  /*
   * Imports what was pasted, asked twice when there is anything to ask about: a name this
   * dashboard already has, or anything the template would be allowed to do - the same scan
   * a shared post gets, since a paste is a post that arrived by another route. Both are said
   * on the first press, together, and the second press goes ahead. A plain paste of a plain
   * template is still one press.
   */
  private _import(): void {
    if (!this._config) return;

    if (!this._importParses) {
      this._importErrors = [localize('share.import_not_yaml', undefined, this.hass)];
      return;
    }

    const result = validateImport(this._importValue);
    if (!result.ok) {
      this._importErrors = result.errors;
      this._importClash = undefined;
      return;
    }
    this._importErrors = [];

    const name = this._importValue.template;
    const existing = collectTemplates(this._savedLovelace);
    const clash = name !== this._config.template && name in existing ? name : undefined;
    // The includes sit inside the pasted value, so the walk over it takes them in too.
    const risks = communityRisks({ template: this._importValue, includes: {} });
    if ((clash && !this._importClash) || (anyRisk(risks) && !this._importRisks)) {
      this._importClash = clash;
      this._importRisks = anyRisk(risks) ? risks : undefined;
      this._importArmedAt = Date.now();
      return;
    }
    if (Date.now() - this._importArmedAt < SECOND_PRESS_MS) return;

    this._applyImport(name);
  }

  /*
   * The other way out of a name clash: keep both, under the first free spelling of the
   * name. What arrives is the same template - only its name changes.
   */
  private _importAsCopy(): void {
    if (!this._config || !this._importParses) return;
    // Only offered after the first press, which has already said what there is to say.
    if (Date.now() - this._importArmedAt < SECOND_PRESS_MS) return;
    const existing = Object.keys(collectTemplates(this._savedLovelace));
    this._applyImport(freeName(this._importValue.template, existing));
  }

  private _applyImport(name: string): void {
    /*
     * A paste is not an install from the shared list, whatever it says about itself: a
     * `source:` stamp in it would point Check for updates at a post of the paster's choosing,
     * so it comes off the template and off everything it carries before any of it is kept.
     */
    const value = withoutSources(this._importValue);
    /*
     * A bundle carries the templates this one uses under `includes:`. The ones this
     * dashboard does not have yet land in decluttering_templates, so the imported
     * template works on arrival; the ones it already has are left exactly as they are.
     */
    const includes = value.includes;
    if (includes && typeof includes === 'object' && !Array.isArray(includes)) {
      const existing = Object.keys(collectTemplates(this._savedLovelace));
      const wanted = Object.entries(includes).filter(([each]) => !existing.includes(each));
      if (wanted.length) {
        void this._saveDashboard(
          (config) =>
            wanted.reduce(
              (built, [each, template]) => addTemplateToRoot(built, each, template as TemplateConfig),
              config,
            ),
          'import',
          // The import also replaces what the dialog holds, so an undo puts that back too.
          this._config,
        );
      }
    }

    // Keep the card's own type: the export may have come from the legacy tag, and which
    // tag this card uses is a property of where it lives, not of what was shared.
    const applied = { ...value, template: name, type: this._config?.type };
    delete applied.includes;
    this._fireConfigChanged(applied);
    this._importClash = undefined;
    this._importRisks = undefined;
    this._selectedTab = 'settings';
  }

  /*
   * Read the panel off the clicked tab rather than listening for the tab group's own
   * show event, whose name has followed the underlying component through several
   * renames. A click on the tab strip is the same signal and does not move.
   */
  private _activateTab(ev: Event): void {
    const tab = ev.composedPath().find((node) => (node as HTMLElement).localName === 'ha-tab-group-tab') as
      HTMLElement | undefined;
    const panel = tab?.getAttribute('panel');
    if (panel) this._selectedTab = panel;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config) return;
    const data = ev.detail.value;
    const config = { ...this._config, template: data.template, default: data.default };
    /*
     * The field shows `default:` and `defaults:` folded together. Left alone, both stay as
     * they were written; edited, what it now holds is the whole list, so it goes back under
     * the one name rather than being merged with the plural a second time.
     */
    if (this._config.defaults !== undefined) {
      if (JSON.stringify(data.default) === JSON.stringify(templateDefaults(this._config))) {
        config.default = this._config.default;
      } else {
        delete config.defaults;
      }
    }
    // Unlike the stubs below, these replace whatever is already there rather than only
    // filling in what is absent.
    setOrDelete(config, 'description', data.description);
    setOrDelete(config, 'variables', data.variables);
    // A group is a card template's body too, so it stays while the type stays a card - without
    // this, editing any setting gave the group a starter card beside it and broke the template.
    const keepsGroup = config.group !== undefined && data.thingType === 'card';
    if (!keepsGroup) delete config.group;
    for (const [thingType, stub] of Object.entries(THING_STUBS)) {
      DeclutteringTemplateEditor.stubMember(!keepsGroup && data.thingType === thingType, config, thingType, stub);
    }
    this._fireConfigChanged(config);
  }

  private _cardChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;

    this._suggestion = undefined;
    this._suggestedNothing = false;
    const config = { ...this._config, card: ev.detail.config };
    this._fireConfigChanged(config);
  }

  private _cardPicked(ev: CustomEvent): void {
    this._selectedTab = 'card';
    this._cardChanged(ev);
  }

  private _rowChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;

    const config = { ...this._config, row: ev.detail.config };
    this._fireConfigChanged(config);
  }

  private _fireConfigChanged(config: DeclutteringTemplateConfig): void {
    // Any change invalidates a suggestion computed against the old template - applying a
    // stale one would rewrite a card the user has since edited, or clash with a name they
    // have since declared.
    this._suggestion = undefined;
    this._suggestedNothing = false;
    fireEvent(this, 'config-changed', { config });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static stubMember(include: boolean, dict: any, name: string, stub: any): void {
    if (include) {
      if (!(name in dict)) dict[name] = stub;
    } else {
      delete dict[name];
    }
  }
}

/**
 * Defines `tag`, unless something else already claimed it — either the original
 * decluttering-card, or a second copy of this bundle. Returns true if this bundle
 * ended up owning the tag.
 */
function defineElement(tag: string, cls: CustomElementConstructor): boolean {
  if (customElements.get(tag)) {
    console.warn(localize('warn.tag_taken', { tag }));
    return false;
  }
  customElements.define(tag, cls);
  return true;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customCards: any[] = ((window as any).customCards = (window as any).customCards || []);
// Home Assistant keeps a separate registry for badges, which is what its badge picker reads.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const customBadges: any[] = ((window as any).customBadges = (window as any).customBadges || []);

// Shown as the documentation link on the entry in Home Assistant's card and badge pickers.
const DOCUMENTATION_URL = 'https://github.com/tempus2016/decluttering-card-plus';

defineElement(CARD_EDITOR_TAG, DeclutteringCardEditor);
defineElement(TEMPLATE_EDITOR_TAG, DeclutteringTemplateEditor);

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
  customCards.push({
    type: CARD_TAG,
    documentationURL: DOCUMENTATION_URL,
    name: 'Decluttering Card Plus',
    preview: false,
    description: localize('picker.card_description'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getEntitySuggestion: (hass: any, entityId: string) => suggestionsFor(hass, entityId, 'card'),
  });
  customBadges.push({
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

/*
 * The view strategy - `strategy: { type: custom:decluttering-card-plus }` on a view - which
 * writes out a section or a badge per item. Home Assistant asks the element for the view
 * through a static `generate`, and never creates one; see strategy.ts.
 */
class DeclutteringViewStrategy extends HTMLElement {
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
    return generateView(config, hass, { ...sourceContext(getLovelaceConfig()), rendered });
  }
}

defineElement(STRATEGY_TAG, DeclutteringViewStrategy);

/*
 * The dashboard strategy - the same `type: custom:decluttering-card-plus`, written as the
 * dashboard's own strategy - which writes out a view per item. Home Assistant tells the two
 * apart by where the strategy is written, and looks each up under a tag of its own.
 * Custom dashboard strategies are older than anything else this card needs (Home Assistant
 * 2021.5), so there is no newer floor for this one. See strategy.ts.
 */
class DeclutteringDashboardStrategy extends HTMLElement {
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

defineElement(DASHBOARD_STRATEGY_TAG, DeclutteringDashboardStrategy);

/*
 * One copy of a `lazy: true` repeat, waiting to come into view. The card has already
 * worked out what the copy is; this holds its place in the stack at the height a built
 * copy took, and creates the real card once it is within a few hundred pixels of the
 * screen. Once built it stays built - scrolling back up does not tear it down again.
 */
/*
 * The first copy is built straight away, but it is only the empty shell of a card when the
 * waiting copies first measure it - 34px of a 133px card - and every placeholder kept that,
 * so the page jumped as each one came in. The copies waiting on a first copy follow its
 * height as it settles instead: one observer for every first copy, each telling the copies
 * that copy their height from it.
 */
const waitingOn = new WeakMap<Element, Set<DeclutteringLazyCopy>>();
const firstCopies =
  typeof ResizeObserver === 'undefined'
    ? undefined
    : new ResizeObserver((entries) => {
        for (const entry of entries) for (const copy of waitingOn.get(entry.target) ?? []) copy.holdPlace();
      });

class DeclutteringLazyCopy extends HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _card?: any;
  // The first copy whose height this one is keeping, while it waits.
  private _following?: Element;
  private _hassValue?: HomeAssistant;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _built?: any;
  private _watch?: IntersectionObserver;
  private _sized?: ResizeObserver;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public setConfig(config: any): void {
    this._card = config?.card;
    if (this._built) this._configure(this._built);
  }

  set hass(hass: HomeAssistant) {
    this._hassValue = hass;
    if (this._built) this._built.hass = hass;
  }

  public connectedCallback(): void {
    if (this._built) return;
    this.style.display = 'block';
    this.holdPlace();
    this._follow();
    // The first copy may not be in the stack yet when this one is put on the page.
    requestAnimationFrame(() => {
      if (this._built || !this.isConnected) return;
      this.holdPlace();
      this._follow();
    });
    if (typeof IntersectionObserver === 'undefined') {
      this._build();
      return;
    }
    this._watch ??= new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) this._build();
      },
      { rootMargin: LAZY_MARGIN },
    );
    this._watch.observe(this);
  }

  public disconnectedCallback(): void {
    this._watch?.disconnect();
    this._unfollow();
  }

  /*
   * The first copy in the same stack, which was built straight away. Each copy sits in a
   * hui-card of its own, side by side in the stack, so the first of those is two levels up
   * and across. Anything else in the way and there is none.
   */
  private _firstCopy(): Element | undefined {
    const own = this.parentElement;
    const first = own?.parentElement?.firstElementChild;
    return first && first !== own && first !== this ? first : undefined;
  }

  /** Keeps the first copy's height, or the default height when there is none to go by. */
  public holdPlace(): void {
    if (this._built) return;
    this.style.minHeight = `${placeholderHeight(this._firstCopy()?.getBoundingClientRect().height)}px`;
  }

  private _follow(): void {
    const first = this._firstCopy();
    if (!first || !firstCopies || first === this._following) return;
    this._unfollow();
    this._following = first;
    const copies = waitingOn.get(first) ?? new Set<DeclutteringLazyCopy>();
    if (!copies.size) firstCopies.observe(first);
    copies.add(this);
    waitingOn.set(first, copies);
  }

  private _unfollow(): void {
    const first = this._following;
    if (!first) return;
    this._following = undefined;
    const copies = waitingOn.get(first);
    copies?.delete(this);
    if (copies && !copies.size) {
      waitingOn.delete(first);
      firstCopies?.unobserve(first);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _configure(thing: any): void {
    if (thing.localName === 'hui-card') thing.config = this._card;
    else thing.setConfig?.(this._card);
  }

  private async _build(): Promise<void> {
    if (this._built || !this._card) return;
    this._watch?.disconnect();
    this._unfollow();
    // Home Assistant's own card wrapper, as for every other card this bundle creates.
    const wrapper = customElements.get('hui-card');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let thing: any;
    if (wrapper) {
      thing = new wrapper();
      thing.config = this._card;
    } else if (HELPERS) {
      thing = (await HELPERS).createCardElement(this._card);
    } else {
      thing = createThing(this._card);
    }
    this._built = thing;
    if (this._hassValue) thing.hass = this._hassValue;
    this.appendChild(thing);
    // The room kept for it is let go once the card has a size of its own, not before, or
    // everything below would jump up and back down again.
    this._sized = new ResizeObserver(() => {
      if (thing.getBoundingClientRect().height > 0) {
        this.style.minHeight = '';
        this._sized?.disconnect();
      }
    });
    this._sized.observe(thing);
  }

  public getCardSize(): number | Promise<number> {
    return this._built?.getCardSize?.() ?? 1;
  }
}

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
