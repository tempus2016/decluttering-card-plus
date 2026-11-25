import { withSlotVariables } from './slots';
import { unknownTemplateKeys } from './template-keys';
import { LitElement, html, TemplateResult, css, CSSResult } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { HomeAssistant, fireEvent, LovelaceCardEditor, LovelaceConfig } from 'custom-card-helpers';
import { DeclutteringCardConfig, TemplateConfig, VariablesConfig, FormSchemaEntry } from './types';
import deepReplace, { BuildExtras, fillSource } from './deep-replace';
import './preview-frame';
import { structureNames } from './structure';
import {
  collectTemplates,
  collectAllTemplates,
  findTemplateLocation,
  mayBorrowTemplates,
  templatePickerOptions,
  replaceCard,
  applyOverride,
  misplacedOverrides,
  byDomainOf,
  pickTemplate,
  withPickedEntity,
  deprecationOf,
  itemTemplatesOf,
  borrowedFrom,
  moveItem,
  collectDefaults,
  libraryShares,
  libraryRead,
} from './templates';
import { BuildCache, buildKey } from './card-editor/build-cache';

// #430: how long the Result waits after a change before it is built.
const RESULT_WAIT_MS = 250;
import { hassLanguage, translatedTemplates } from './translations';
import {
  diagnoseInstance,
  itemTemplatesReached,
  validateDeclared,
  declarationSelector,
  groupDeclarations,
  declarationShown,
  hasVisibilityConditions,
  templateGroups,
  filledReader,
  resolveVariables,
  isCardDeclaration,
  forEachItems,
  forEachNames,
  forEachVariables,
  getDeclarations,
  mergeVariables,
  ownVariables,
  POSITION_NAMES,
  variableName,
  variableValues,
  VariableDeclaration,
  withStateScope,
  normaliseVariables,
  PLACEHOLDER,
} from './variables';
import { hasOptionsFrom, optionsFromSelector } from './options-from';
import { copyLabel, entitiesLeftOut, isRegistrySource, registryNames, resolveRegistryItems } from './registry';
import { categoryRegistry, loadCategories, wantsCategories } from './categories';
import { renderTemplateOnce, sourceTemplate, TemplateRender, templateList } from './template-source';
import { findRepeatingCard, sectionPerCopy } from './strategy';
import { copyText, getLovelaceConfig, getLovelacePanel } from './utils';
import { toYaml } from './yaml';
import { localize, onLanguageLoaded } from './localize';
import { isRebuildPlaceholder, rebuildOnEach, RebuildOnEntry, rebuildOnFor } from './rebuild-resolve';
import { isRebuildObject, rebuildEntryEntity } from './rebuild';
import {
  advancedCount,
  advancedData,
  advancedSchema,
  hasOwnWatch,
  AdvancedData,
  applyAdvanced,
  rebuildPlaceholders,
  withoutRebuildEntry,
  watchText,
  onErrorCard,
  withOnErrorCard,
  OnErrorMode,
} from './card-editor/advanced';
import { EditorHidden, editorHidden, withoutFields } from './card-editor/hide';
import {
  DefaultPlaces,
  defaultText,
  filledAllowed,
  filledDefault,
  matchesDefault,
  isShownValue,
  defaultTarget,
  hasResetSlot,
  defaultLine,
  resetVariable,
  shownDefaults,
  withoutVariable,
} from './card-editor/defaults';
import { changedNames, leftBehind, nextNotes, stillBehind } from './card-editor/left-behind';
import { onlyLeaveFieldsChanged } from './card-editor/preview-on';
import { CARD_SLOT_TAG } from './card-editor/card-slot';
import { buildTime, previewLines, PreviewLine, previewModes, PreviewMode } from './card-editor/result-preview';
import {
  notePreviewBuild,
  onPreviewHold,
  previewEditorOpened,
  previewPauseOn,
  previewSlowPause,
  renderPreviewNow,
  requiredUnset,
  setPreviewPaused,
} from './preview-hold';
import {
  cardAtPath,
  dashboardHref,
  ReturnTicket,
  stashReturn,
  takeReturn,
  templateCardPath,
} from './card-editor/template-link';
import {
  applyByDomainRows,
  ByDomainRow,
  byDomainRows,
  cardTemplateOptions,
  hasByDomain,
  isReadableByDomain,
  remainingDomains,
  startByDomain,
  stopByDomain,
} from './card-editor/by-domain';
import {
  applyRepeat,
  isDrawableSource,
  listItemLabel,
  repeatBuilderSchema,
  repeatData,
  RepeatData,
  repeatMode,
  RepeatMode,
  repeatModeOptions,
  sourceKind,
  withListItem,
  withNewListItem,
  withoutListItem,
  withRepeatMode,
} from './card-editor/repeat-builder';
import { knownDomains } from './card-editor/repeat-builder';
import {
  countText,
  filterPickerItems,
  groupHeading,
  isBaseTemplate,
  PickerItem,
  pickerItems,
} from './card-editor/template-picker';
import { ComboItem, pickerList } from './card-editor/generic-picker';
import { isDefinedHere } from './template-editor/common';
import { applyPreset, presetConflicts, presetMatching, presetOptions } from './card-editor/presets';
import { holdUndo } from './undo';
import {
  choosingTemplate,
  isBareStub,
  keepingTemplates,
  newTemplateCard,
  withLibraryInstalled,
} from './card-editor/first-run';
import { LIBRARY, libraryEntry, libraryNeeds } from './library';
import { GalleryEntry, galleryEntries } from './gallery';
import type { GalleryStatus } from './gallery-dialog';
import { missingCustomCards } from './share';
import { VERSION } from './version';
import {
  namesToFill,
  repeatsNow,
  requiredProgress,
  StatusCounts,
  statusLevel,
  statusParts,
} from './card-editor/status';
import { Alert, checksOf, runChecks } from './checks';
import {
  currentViewIndex,
  dialogPlace,
  editDialogOf,
  GALLERY_TAG,
  inSectionStrategyEditor,
  getThingType,
  isVariablesShape,
  loadCardEditorPicker,
  leftOutParams,
  pageDashboard,
  rewriteDashboards,
  setOrDelete,
  sourceContext,
  thingContent,
} from './shared';

// One thing the diagnostics say, and whether it is the required variables left unset.
interface DiagnosisAlert {
  level: 'error' | 'warning' | 'info';
  body: TemplateResult;
  fill: boolean;
}

interface Diagnosis {
  alerts: DiagnosisAlert[];
  // The required variables with no value, which the counter and the status line count.
  needed: string[];
}

// Declared variables get their own form field, and the prefix keeps a variable called
// "template" from colliding with the field that chooses the template.
const VARIABLE_FIELD_PREFIX = 'variable:';

// mdi:alert-circle-outline and mdi:information-outline, on the status line under the preview.
const ALERT_PATH =
  'M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z';
const INFO_PATH =
  'M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z';

// mdi:close, on a rebuild_on placeholder's remove button (#411).
const REMOVE_PATH =
  'M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z';

// mdi:restore, on the Reset beside a declared variable the card sets (#255).
const RESET_PATH =
  'M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z';

/** A declared field's Reset (#255): what it falls back to, as text, and where that is written. */
/** An entry of the variables form's schema, as far as the per-field drawing reads it. */
interface SchemaEntry {
  name?: string;
  type?: string;
  title?: string;
  label?: string;
  helper?: string;
  /** An expandable that starts open (#473). */
  expanded?: boolean;
  disabled?: boolean;
  schema?: SchemaEntry[];
}

interface FieldReset {
  text: string;
  source: string;
  /** Whether the card sets the field, which is when its Reset shows. */
  set: boolean;
}

/** What a repeat source matches, as the matches line names it: entities, areas, views ... */
function matchedWhat(source: unknown, count: number, hass: unknown): string {
  const keys = ['areas', 'devices', 'floors', 'labels', 'views', 'entities'];
  const written = (source && typeof source === 'object' ? source : {}) as Record<string, unknown>;
  // Filters on their own mean entities, as the card reads them.
  const kind = keys.find((key) => written[key] !== undefined) ?? (isRegistrySource(source) ? 'entities' : 'items');
  return localize(`editor.matches_${kind}_${count === 1 ? 'one' : 'many'}`, undefined, hass as undefined);
}

// What looks like an entity id, which a placeholder reads rather than a variable.
const ENTITY_ID_LIKE = /^[a-z0-9_]+\.[a-z0-9_]+$/i;

// How many matches the editor lists before it stops. Enough to see the filter is right,
// few enough that a sweep of the whole house does not fill the dialog.
const MATCHES_SHOWN = 12;

// mdi:drag, the handle a list that can be dragged into order shows on each item.
const DRAG_PATH =
  'M7,19V17H9V19H7M11,19V17H13V19H11M15,19V17H17V19H15M7,15V13H9V15H7M11,15V13H13V15H11M15,15V13H17V15H15M7,11V9H9V11H7M11,11V9H13V11H11M15,11V9H17V11H15M7,7V5H9V7H7M11,7V5H13V7H11M15,7V5H17V7H15Z';

// One shared instance, built on first use so it speaks the user's language: the editor
// re-renders on every state change Home Assistant sends, and a fresh schema object each
// time would mark every field dirty for no reason.
let REPEAT_SCHEMA: unknown[] | undefined;

function repeatSchema(): unknown[] {
  REPEAT_SCHEMA ??= [
    {
      name: 'gap',
      label: localize('editor.gap_label'),
      helper: localize('editor.gap_helper'),
      selector: { number: { min: 0, max: 64, mode: 'box' } },
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

function splitAt(sentence: string, token: string): [string, string] {
  const at = sentence.indexOf(token);
  return at === -1 ? [sentence, ''] : [sentence.slice(0, at), sentence.slice(at + token.length)];
}

// The words a typed boolean's switch shows as on; every other word shows it off.
const TRUE_WORDS = new Set(['true', 'yes', 'on', '1']);

// A style rule that paints on this card's own host rather than on the card inside it.
const HOST_SELECTOR = /:host|\.decluttering-container/;

export class DeclutteringCardEditor extends LitElement implements LovelaceCardEditor {
  static get styles(): CSSResult {
    return css`
      /* Code stays left to right inside a right-to-left sentence. */
      code {
        direction: ltr;
        unicode-bidi: isolate;
      }
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          transition: none !important;
          animation: none !important;
        }
      }
      .description {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
      }
      .hint {
        margin: 0 0 8px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      .hint a {
        color: var(--primary-color);
      }
      ha-alert {
        display: block;
        margin-bottom: 8px;
      }
      ha-expansion-panel,
      decluttering-card-plus-health {
        margin-top: 16px;
      }
      .risks {
        margin: 4px 0 0;
        padding-inline-start: 18px;
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
      .advanced .count {
        color: var(--secondary-text-color);
        font-size: 0.85em;
        margin-inline-start: 8px;
      }
      .advanced-body {
        padding: 8px 8px 0;
      }
      /* What rebuild_on holds that the entity picker cannot draw (#411). */
      .rebuild-extra {
        margin: 12px 0 24px;
        color: var(--secondary-text-color);
        font-size: 0.9em;
      }
      /* The words line up with the field's helper above them, the boxes with the field. */
      .rebuild-label {
        margin: 0 0 4px;
        padding-inline-start: 16px;
      }
      .rebuild-list {
        list-style: none;
        margin: 0 0 8px;
        padding: 0;
      }
      .rebuild-list li {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 0 8px;
        min-height: 40px;
        padding-inline-start: 12px;
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        margin-bottom: 4px;
      }
      .rebuild-list code {
        color: var(--primary-text-color);
        font-family: var(--ha-font-family-code, monospace);
        overflow-wrap: anywhere;
      }
      .rebuild-filled {
        flex: 1;
        min-width: 0;
        overflow-wrap: anywhere;
      }
      .rebuild-remove {
        --mdc-icon-button-size: 40px;
        margin-inline-start: auto;
      }
      .rebuild-template {
        margin: 0;
        padding-inline-start: 16px;
        overflow-wrap: anywhere;
      }
      ha-expansion-panel.preview {
        display: block;
        margin: 0 0 16px;
      }
      .preview-body {
        padding: 8px 8px 0;
      }
      .preview-body > .segmented {
        margin: 0 0 10px;
      }
      .preview-title {
        font-weight: 500;
      }
      ha-alert.preview-held {
        display: block;
        margin: 0 0 16px;
      }
      .segmented {
        display: inline-flex;
        border: 1px solid var(--divider-color);
        border-radius: 18px;
        overflow: hidden;
      }
      .segmented button {
        border: 0;
        background: transparent;
        color: var(--secondary-text-color);
        font: inherit;
        padding: 6px 14px;
        cursor: pointer;
      }
      .segmented button.on {
        background: rgba(var(--rgb-primary-color), 0.12);
        color: var(--primary-color);
        font-weight: 500;
      }
      .rendered {
        margin: 0 0 8px;
      }
      pre.yaml {
        margin: 0 0 8px;
        padding: 8px 10px;
        border-radius: 8px;
        background: var(--secondary-background-color);
        font-family: var(--ha-font-family-code, monospace);
        font-size: 12.5px;
        line-height: 1.5;
        overflow: auto;
        max-height: 320px;
        -webkit-user-select: text;
        user-select: text;
      }
      pre.yaml .l {
        display: block;
        white-space: pre;
        /* Code reads left to right in a right-to-left dashboard too. */
        direction: ltr;
        text-align: left;
      }
      pre.yaml .l.changed {
        background: rgba(var(--rgb-accent-color, 255, 152, 0), 0.18);
      }
      .preview-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .edit-template {
        margin-inline-start: 6px;
      }
      ha-alert .actions {
        margin-top: 8px;
        display: flex;
        gap: 8px;
      }
      .repeat h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 8px 0 12px;
      }
      .matches-line {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 12px;
        margin: 0 0 12px;
        border-radius: 8px;
        background: rgba(var(--rgb-success-color, 76, 175, 80), 0.12);
      }
      .matches-line ha-svg-icon {
        color: var(--success-color);
      }
      .matches-line span {
        flex: 1;
      }
      .matches {
        margin: -4px 0 12px;
      }
      .items {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .items li {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 2px 6px;
        margin: 0 0 6px;
      }
      .item-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .item-row .handle {
        color: var(--secondary-text-color);
        cursor: grab;
      }
      .item-row .spacer {
        flex: 1;
      }
      .by-domain-switch {
        display: block;
        margin: 12px 0 4px;
      }
      .by-domain-off .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
      }
      .by-domain h3 {
        font-size: 16px;
        font-weight: 500;
        margin: 8px 0 4px;
      }
      .bd-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 12px;
      }
      .bd-row ha-selector {
        flex: 1;
        min-width: 0;
      }
      .bd-row .bd-default {
        flex: 1;
        color: var(--secondary-text-color);
      }
      .bd-row .bd-spacer {
        width: 48px;
      }
      .picker {
        display: block;
        margin: 0 0 16px;
      }
      .first-run {
        display: grid;
        gap: 12px;
        margin: 0 0 16px;
      }
      .first-run-empty {
        border: 1px dashed var(--divider-color);
        border-radius: 12px;
        padding: 20px 16px;
        text-align: center;
      }
      .first-run-empty ha-icon {
        --mdc-icon-size: 32px;
        color: var(--secondary-text-color);
      }
      .first-run-empty h3 {
        margin: 8px 0 4px;
        font-size: 16px;
        font-weight: 500;
      }
      .first-run-empty .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        margin-top: 12px;
      }
      .starters {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 8px;
        padding: 0 12px 12px;
      }
      .starter {
        display: grid;
        gap: 2px;
        text-align: start;
        font: inherit;
        color: var(--primary-text-color);
        background: var(--card-background-color);
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 10px 12px;
        cursor: pointer;
      }
      .starter:hover,
      .starter:focus-visible {
        border-color: var(--primary-color);
      }
      .starter:disabled {
        opacity: 0.6;
        cursor: progress;
      }
      .starter-name {
        font-family: var(--ha-font-family-code, monospace);
        font-weight: 500;
      }
      .starter-about,
      .starter small {
        color: var(--secondary-text-color);
      }
      .variables {
        display: block;
        margin: 0 0 16px;
      }
      /* A required field with no value, under it like the default line, in the error colour. */
      .declared-field .required-line {
        order: 1;
        flex-basis: 100%;
        padding: 0 12px;
        font-size: 12px;
        line-height: 16px;
        color: var(--error-color);
      }
      .variables-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 8px;
      }
      .variables-head h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 500;
      }
      .variables-head .counter {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-variant-numeric: tabular-nums;
      }
      .progress {
        height: 4px;
        border-radius: 2px;
        background: var(--divider-color);
        margin: 6px 0 12px;
        overflow: hidden;
      }
      .progress i {
        display: block;
        height: 100%;
        background: var(--primary-color);
        transition: width 0.2s ease;
      }
      .status {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 8px 0 16px;
        padding: 4px 4px 4px 12px;
        border-radius: 8px;
        background: rgba(var(--rgb-warning-color, 255, 166, 0), 0.12);
      }
      .status.error {
        background: rgba(var(--rgb-error-color, 219, 68, 55), 0.12);
      }
      .status.info {
        background: rgba(var(--rgb-info-color, 3, 155, 229), 0.12);
      }
      .status ha-svg-icon {
        flex: none;
        color: var(--warning-color);
      }
      .status.error ha-svg-icon {
        color: var(--error-color);
      }
      .status.info ha-svg-icon {
        color: var(--info-color);
      }
      .status-text {
        flex: 1;
        min-width: 0;
      }
      .status-detail {
        margin: -8px 0 16px;
      }
      .pick-row {
        padding: 4px 0;
      }
      .pick-heading {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.02em;
        color: var(--secondary-text-color);
        margin: 2px 0 6px;
      }
      .pick-name {
        display: flex;
        align-items: baseline;
        gap: 10px;
      }
      .pick-name small {
        color: var(--secondary-text-color);
      }
      .pick-name small.unused {
        color: var(--warning-color);
      }
      .pick-description {
        font-size: 12px;
        color: var(--secondary-text-color);
      }
      .presets .actions {
        margin-top: 8px;
        display: flex;
        gap: 8px;
      }
      /* The declared variables, one form each so a field can carry its Reset (#255). */
      .declared > *:not(:last-child),
      .declared-group-body > *:not(:last-child) {
        margin-bottom: 24px;
      }
      .declared-field {
        display: flex;
        align-items: flex-start;
        gap: 4px;
      }
      .declared-field ha-form {
        flex: 1;
        min-width: 0;
      }
      /* The Reset's place, kept on every field that could have one so widths never move (#255). */
      .declared-field .reset-slot {
        flex: none;
        width: 48px;
        margin-top: 4px;
      }
      .declared-field .reset {
        color: var(--secondary-text-color);
      }
      /* #469: the note under a changed field takes a line of its own, below the field and its Reset. */
      .declared-field {
        flex-wrap: wrap;
      }
      /* #483: a set field's default, apart from its description and below the field. */
      .declared-field .default-line {
        order: 1;
        flex-basis: 100%;
        padding: 0 12px;
        font-size: 12px;
        line-height: 16px;
        color: var(--secondary-text-color);
        overflow-wrap: anywhere;
      }
      .declared-field .default-value {
        font-family: var(--ha-font-family-code, monospace);
        color: var(--primary-text-color);
      }
      .declared-field .left-behind {
        order: 1;
        flex-basis: 100%;
        margin-top: 8px;
      }
      ha-expansion-panel.declared-group {
        display: block;
        margin-top: 0;
        --expansion-panel-content-padding: 0;
        border-radius: 6px;
        --ha-card-border-radius: 6px;
      }
      .declared-group-body {
        padding: 12px;
      }
    `;
  }

  @state() private _lovelace?: LovelaceConfig;
  @state() private _config?: DeclutteringCardConfig;

  @property() public hass?: HomeAssistant;

  private _templates?: Record<string, TemplateConfig>;
  // The language the templates' own texts were put in (#392).
  private _templatesLanguage?: string;
  // Typed booleans drawn as a switch other than the value written - see _formData.
  private _shownAs = new Map<string, { shown: unknown; written: unknown }>();
  @state() private _loadingTemplates = false;
  @state() private _ejectPending = false;
  @state() private _sectionsPending = false;
  @state() private _sectionsError?: string;
  // Idea 14: "a card of my choosing" chosen but no card picked yet - nothing to write, so
  // the choice lives here until the slot is filled (round 1, B2).
  @state() private _onErrorMode?: OnErrorMode;
  // Idea 19: how the result is shown, and the lines the last edit changed.
  @state() private _previewMode: PreviewMode = 'yaml';
  /*
   * #407: the previews can be paused from here, the dialog's and the Rendered view alike.
   * The config last built anyway - with Render now - so the Rendered view shows it until
   * the next edit hands a new one.
   */
  @state() private _builtAnyway?: DeclutteringCardConfig;
  private _holdStops: (() => void)[] = [];
  // #430: the editor's builds, each kept until something it reads changes.
  private _builds = new BuildCache();
  // #430: while the card is being typed into, the Result waits this long after the last change.
  private _resultTimer?: ReturnType<typeof setTimeout>;
  private _resultDue = false;
  @state() private _copied = false;
  /*
   * #488: whether the "What it builds" panel is open. It starts folded - most cards never need
   * the YAML - and stays as it was left for as long as the editor is open.
   */
  @state() private _resultOpen = false;
  // Whether the status line under the preview is opened to show everything it stands for.
  @state() private _statusOpen = false;
  // The required variables the Result's last build left unset, for the held banner at the top (#488).
  private _resultNeeded: string[] = [];
  private _lastYaml?: string;
  private _markedLines: PreviewLine[] = [];
  @state() private _cannotOpen = false;
  // Idea 20: unsaved changes left when this card was closed to edit its template.
  @state() private _resume?: ReturnTicket;
  @state() private _matchesOpen = false;
  // Idea 16: rows added but not complete yet, which the mapping cannot hold (round 1, B3).
  @state() private _byDomainDraft?: ByDomainRow[];
  // The by-domain switch turned off, waiting for a yes before the mapping is dropped.
  @state() private _byDomainOffPending = false;
  // Which hand-written items are open for editing, by position.
  @state() private _openItems = new Set<number>();
  private _dragging?: number;
  // Idea 21: the template combo box's rows, as filtered by what was typed.
  @state() private _pickerFilter = '';
  // The first run: the template gallery, and a starter template being put on the dashboard.
  @state() private _galleryOpen = false;
  @state() private _gallerySelected?: string;
  @state() private _installing = false;
  @state() private _installError?: string;
  private _pickerItems: PickerItem[] = [];

  // The template the list was made for: a base it uses stays listed (#444).
  private _pickerCurrent?: string;
  private _pickerFor?: Record<string, TemplateConfig>;
  // The variable groups opened or closed by hand, by title - drawn by the editor itself since
  // #255, so it keeps them. A group not toggled yet starts as its `groups:` entry says (#473).
  @state() private _openGroups = new Map<string, boolean>();
  // A preset waiting for a yes, because it would change values set by hand (idea 44).
  @state() private _presetPending?: { index: number; names: string[] };
  // #469: fields set by hand that an edit left behind, by the field that changed. Only for as long as the editor is open.
  @state() private _leftBehind = new Map<string, string[]>();
  // The card's variables before the edits not yet looked at, and after them.
  private _pendingEdit?: { before: unknown; after: unknown };
  // #510: an edit to a `preview_on: leave` field, kept here until the field is left.
  private _unsent?: DeclutteringCardConfig;
  // Any edit the editor sends carries the held one with it, so the hold ends there.
  private _sentSomething = (ev: Event): void => {
    if (ev.composedPath()[0] === this) this._unsent = undefined;
  };
  // What each `for_each_from: { template: }` written in this editor rendered to, so the
  // match preview can show it. Rendered once per distinct template text, like the card.
  @state() private _renderedTemplates: Record<string, TemplateRender> = {};
  private _renderingTemplates = new Set<string>();
  // #404: each `options_from:` dropdown's choices, worked out once while this editor is open.
  private _optionsFrom = new Map<string, unknown>();
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

  // Stops listening for a language chunk landing (idea 4).
  private _stopLanguageListener?: () => void;

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('config-changed', this._sentSomething);
    this._stopLanguageListener?.();
    this._stopLanguageListener = undefined;
    for (const stop of this._holdStops) stop();
    this._holdStops = [];
    clearTimeout(this._resultTimer);
    this._resultTimer = undefined;
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    this.addEventListener('config-changed', this._sentSomething);
    if (!this._holdStops.length) {
      this._holdStops = [
        onPreviewHold((event) => {
          if (event === 'render') this._builtAnyway = this._config;
          this.requestUpdate();
        }),
        previewEditorOpened(),
      ];
    }
    this._stopLanguageListener ??= onLanguageLoaded(() => {
      this._builds.clear();
      this.requestUpdate();
    });
    // A card-valued variable renders Home Assistant's own card editor and picker, which
    // are lazy-loaded - free after the first editor anywhere has loaded them.
    await loadCardEditorPicker();
  }

  /*
   * A declaration's control, with `options_from:` looked up the first time it is drawn while
   * hass is here and kept for as long as the editor is open (#404).
   */
  private _selectorFor(declaration: VariableDeclaration, template: TemplateConfig | undefined): unknown {
    declaration = this._filledAllowed(declaration, template);
    if (!hasOptionsFrom(declaration)) return declarationSelector(declaration);
    const key = JSON.stringify([
      declaration.options_from,
      declaration.option_value,
      declaration.option_label,
      declaration.selector,
    ]);
    const cached = this._optionsFrom.get(key);
    if (cached) return cached;
    const selector = optionsFromSelector(declaration, this.hass);
    if (this.hass) this._optionsFrom.set(key, selector);
    return selector;
  }

  // #491: each `allowed:` made from a placeholder, filled in, by variable name - with what it was filled from.
  private _allowedFills = new Map<string, { key: string; declaration: VariableDeclaration }>();

  /*
   * A declaration with an `allowed:` made from a placeholder filled in, the way a default is
   * (#491). Worked out again only when the card's variables or the `allowed:` change, not on
   * every state change.
   */
  private _filledAllowed(declaration: VariableDeclaration, template: TemplateConfig | undefined): VariableDeclaration {
    const written: unknown = declaration.allowed;
    if (!template || written === undefined || Array.isArray(written)) return declaration;
    const key = JSON.stringify([this._config?.template, written, this._config?.variables]);
    const cached = this._allowedFills.get(declaration.name);
    if (cached && cached.key === key) return cached.declaration;
    const { extras, hass } = this._defaultReads(template);
    const filled = filledAllowed(
      declaration,
      withoutVariable(this._config?.variables, declaration.name),
      template,
      hass,
      extras,
    );
    if (this.hass) this._allowedFills.set(declaration.name, { key, declaration: filled });
    return filled;
  }

  public setConfig(config: DeclutteringCardConfig): void {
    // A config from Home Assistant replaces anything held back (#510).
    this._unsent = undefined;
    // The first config is the card as the dashboard has it saved; every later one is an edit.
    if (!this._openedWith) {
      this._openedWith = config;
      // Idea 20: this card was left to edit its template; its unsaved changes come back.
      this._resume = takeReturn(config);
    }
    const before = this._config;
    if (before && before.template === config.template) {
      // Several edits before the next update count as one, from where the first started.
      this._pendingEdit = { before: this._pendingEdit?.before ?? before.variables, after: config.variables };
    } else if (before) {
      this._pendingEdit = undefined;
      this._leftBehind = new Map();
    }
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

    // A template's own texts (#392) are shown in the user's language, so a change of it reads them again.
    const language = hassLanguage(this.hass);
    if (this._templates && this._templatesLanguage !== language) {
      this._templates = undefined;
      this._schema = undefined;
    }
    if (!this._templates) {
      const place = this._editingPlace();
      this._templatesLanguage = language;
      this._templates = translatedTemplates(
        collectTemplates(this._lovelace, place.view, undefined, place.section),
        this.hass,
      );
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
    this._noteLeftBehind();
  }

  /*
   * #469: after an edit, the fields set by hand whose worked-out default moved with it. Read
   * here rather than in setConfig because it needs the templates, and before render because
   * it sets state.
   */
  private _noteLeftBehind(): void {
    const edit = this._pendingEdit;
    if (!edit || !this._templates) return;
    this._pendingEdit = undefined;
    const before = edit.before as VariablesConfig[] | VariablesConfig | undefined;
    const after = edit.after as VariablesConfig[] | VariablesConfig | undefined;
    const changed = changedNames(before, after);
    if (!changed.length) return;
    const template = this._templates[this._config?.template as string];
    const declared = getDeclarations(template)
      .filter((declaration) => !isCardDeclaration(declaration))
      .map((declaration) => declaration.name);
    const { places, extras, hass } = this._defaultReads(template);
    const found = leftBehind(declared, before, after, template, hass, extras, places);
    if (!found.length && !this._leftBehind.size) return;
    this._leftBehind = nextNotes(this._leftBehind, changed, found, new Set(declared));
  }

  /** What a default is worked out with in this editor: where the card sits, the item templates, and the states it rebuilds on. */
  private _defaultReads(template: TemplateConfig | undefined): {
    places: DefaultPlaces;
    extras: BuildExtras;
    // The scoped hass a build reads, which is not quite the editor's own.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hass: any;
  } {
    const ll = this._lovelace ?? getLovelaceConfig();
    const place = this._editingPlace();
    const section =
      place.view === undefined || place.section === undefined
        ? undefined
        : (ll as { views?: { sections?: { decluttering_defaults?: VariablesConfig[] }[] }[] } | undefined)?.views?.[
            place.view
          ]?.sections?.[place.section]?.decluttering_defaults;
    return {
      places: { section, dashboard: collectDefaults(ll), library: libraryShares().defaults },
      extras: { itemTemplates: itemTemplatesOf(ll), context: sourceContext(ll) },
      // Read with the states the card rebuilds on, as the shown defaults are (#411).
      hass: withStateScope(this.hass, this._rebuildOnFor(template)),
    };
  }

  /** The note under a field an edit changed, naming the fields it left behind that still are (#469). */
  private _leftBehindNote(name: string, template: TemplateConfig | undefined): TemplateResult {
    const names = this._leftBehind.get(name);
    if (!names?.length) return html``;
    const behind = this._builds.get('left-behind', this._readsKey(template, name, names.join('\n')), () => {
      const { places, extras, hass } = this._defaultReads(template);
      return stillBehind(names, this._config?.variables, template, hass, extras, places);
    });
    if (!behind.length) return html``;
    const labels = new Map(getDeclarations(template).map((declaration) => [declaration.name, declaration.label]));
    const field = labels.get(name) ?? name;
    const fields = behind.map((each) => labels.get(each) ?? each).join(', ');
    return html`<ha-alert alert-type="info" class="left-behind" data-left-behind=${name}>
      ${localize('editor.left_behind.note', { name: field, fields }, this.hass)}
      <div class="actions">
        <ha-button @click=${(): void => this._resetLeftBehind(name, behind)}>
          ${localize('editor.left_behind.reset', undefined, this.hass)}
        </ha-button>
        <ha-button @click=${(): void => this._keepLeftBehind(name)}>
          ${localize('editor.left_behind.keep', undefined, this.hass)}
        </ha-button>
      </div>
    </ha-alert>`;
  }

  // Every named field reset in one change, so undo takes them back together.
  private _resetLeftBehind(name: string, names: string[]): void {
    if (!this._config) return;
    this._keepLeftBehind(name);
    const config = names.reduce((each, field) => resetVariable(each, field), this._config);
    fireEvent(this, 'config-changed', { config });
  }

  private _keepLeftBehind(name: string): void {
    const notes = new Map(this._leftBehind);
    notes.delete(name);
    this._leftBehind = notes;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._config || !this._templates || !this._schema) return html``;

    const template = this._templates[this._config.template];
    const declarations = getDeclarations(template);
    // Fields whose show_if or hide_if says they are not wanted with the values as they stand (#347).
    const hiddenNames = this._hiddenNames(template, declarations);
    const shown = declarations.filter((declaration) => !hiddenNames.has(declaration.name));
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

    const data = this._formData(declarations);
    // What the template says its editor can do without (#344), kept while the card uses it.
    const hidden = editorHidden(template, this._config, (data as { extras?: unknown[] }).extras);

    const error: Record<string, string | string[]> = {};
    // Templates borrowed from another dashboard are still on their way, so do not accuse
    // the user of a bad name until they have arrived.
    // A card choosing by domain may have no template: of its own at all.
    // A card that names no template yet is choosing one, not naming one that is not there.
    const choosing = choosingTemplate(this._config);
    if (!template && !this._loadingTemplates && !(byDomain && !this._config.template) && !choosing) {
      error.template = localize('editor.no_such_template', undefined, this.hass);
    }
    if (!readable) {
      error.variables = localize('error.variables_shape', undefined, this.hass);
    }

    // The picker's stub as it came: choosing a template is all there is to do yet.
    if (choosing && isBareStub(this._config)) {
      return html`${this._renderResume()} ${this._renderTemplatePicker(undefined)} ${this._renderFirstRun()}`;
    }

    const retired = deprecationOf(template);
    // Drawn first, as the status line needs to know what its build left unset (#488).
    const result = this._renderResult(template, hidden.preview);
    const diagnosis = this._diagnose(template, readable);
    /*
     * The order (UX pass): choose the template, fill its variables, see what it builds with
     * one line for everything the diagnostics say, and the rest folded into Advanced. A card
     * that repeats keeps its Repeat out in the open, since the repeat is what that card is.
     */
    const repeatOut = repeatsNow(this._config as Record<string, unknown>);
    const repeatBlock = html`${this._renderRepeat(repeatable && !hidden.repeat, template)}
    ${this._renderLayout(data, repeatable && !hidden.repeat, hidden)} ${this._renderEmptySlot(repeatable)}`;
    return html`
      ${this._renderHeld()} ${this._renderResume()} ${this._renderTemplatePicker(error.template)}
      ${choosing ? this._renderFirstRun() : html``} ${this._renderSource(template)}
      ${template?.description ? html`<p class="description">${template.description}</p>` : html``}
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
      ${
        /*
         * The form has no way to edit a mapping of domains to templates, but it does not
         * need one to leave it alone: every save carries the rest of the config through,
         * and the mapping is changed in the code editor.
         */
        byDomain && (hidden.repeat || !repeatable) ? this._renderByDomain(byDomain) : html``
      }
      ${this._renderVariables(data, shown, hidden, template, error, diagnosis)} ${repeatOut ? repeatBlock : html``}
      ${result} ${this._renderStatus(diagnosis)}
      ${this._renderAdvanced(
        hidden,
        html`${this._renderPresets(template)} ${repeatOut ? html`` : repeatBlock}`,
        html`${this._renderSectionPerCopy()}
          <decluttering-card-plus-health
            .hass=${this.hass}
            .lovelace=${this._lovelace}
          ></decluttering-card-plus-health>`,
      )}
    `;
  }

  /*
   * The variables, straight after the picker: a heading with how many of the required ones
   * are set and a bar that fills as they are, then the form. An empty required field says
   * which template wants it.
   */
  private _renderVariables(
    data: Record<string, unknown>,
    shown: VariableDeclaration[],
    hidden: EditorHidden,
    template: TemplateConfig | undefined,
    error: Record<string, string | string[]>,
    diagnosis: Diagnosis,
  ): TemplateResult {
    const declarations = template ? getDeclarations(template) : [];
    const progress = requiredProgress(
      declarations,
      this._hiddenNames(template, declarations),
      namesToFill(diagnosis.needed, this._resultNeeded),
    );
    return html`
      <section class="variables" aria-labelledby="variables-heading">
        ${
          shown.length
            ? html`<div class="variables-head">
                  <h3 id="variables-heading">${localize('editor.variables_label', undefined, this.hass)}</h3>
                  ${
                    progress.total
                      ? html`<span class="counter">
                          ${localize('editor.variables.required_set', progress, this.hass)}
                        </span>`
                      : html``
                  }
                </div>
                ${
                  progress.total
                    ? html`<div
                        class="progress"
                        role="progressbar"
                        aria-labelledby="variables-heading"
                        aria-valuemin="0"
                        aria-valuemax=${progress.total}
                        aria-valuenow=${progress.set}
                      >
                        <i style=${`width: ${(100 * progress.set) / progress.total}%`}></i>
                      </div>`
                    : html``
                }`
            : html``
        }
        ${this._renderVariablesForm(data, shown, hidden, template, error, diagnosis.needed)}
        ${this._renderCardVariables(shown)}
      </section>
    `;
  }

  /*
   * Everything the diagnostics say, and the preview held for a required variable, as one
   * line under the preview: what there is, and Show to read it in full.
   */
  private _renderStatus(diagnosis: Diagnosis): TemplateResult {
    const paused = previewPauseOn();
    const toFill = namesToFill(diagnosis.needed, paused ? [] : this._resultNeeded);
    const counts: StatusCounts = {
      toFill: toFill.length,
      errors: diagnosis.alerts.filter((each) => each.level === 'error' && !each.fill).length,
      warnings: diagnosis.alerts.filter((each) => each.level === 'warning').length,
      notes: diagnosis.alerts.filter((each) => each.level === 'info').length,
    };
    const parts = statusParts(counts);
    if (!parts.length) return html``;
    const level = statusLevel(counts);
    const open = this._statusOpen;
    return html`
      <div class="status ${level}" role="status">
        <ha-svg-icon .path=${level === 'info' ? INFO_PATH : ALERT_PATH}></ha-svg-icon>
        <span class="status-text">
          ${parts.map((part) => localize(part.key, { count: part.count }, this.hass)).join(' · ')}
        </span>
        <ha-button
          appearance="plain"
          class="status-toggle"
          aria-expanded=${open ? 'true' : 'false'}
          @click=${(): void => {
            this._statusOpen = !open;
          }}
        >
          ${localize(open ? 'editor.status.hide' : 'editor.status.show', undefined, this.hass)}
        </ha-button>
      </div>
      ${
        open
          ? html`<div class="status-detail">
              ${!paused && this._resultNeeded.length ? this._renderHeldAlert(false) : html``}
              ${diagnosis.alerts.map((each) => html`<ha-alert alert-type=${each.level}>${each.body}</ha-alert>`)}
            </div>`
          : html``
      }
    `;
  }

  /*
   * Idea 14: the settings that were YAML-only, in one expandable at the bottom. Collapsed by
   * default, so a card that uses none of them looks exactly as it did; the summary says how
   * many are set so a card with a style or a fallback shows it without opening.
   */
  private _renderAdvanced(hidden: EditorHidden, before: TemplateResult, after: TemplateResult): TemplateResult {
    if (!this._config) return html``;
    // `editor_hide: advanced` takes the panel's own settings away; what moved into it stays, out in the open.
    if (hidden.advanced) return html`${before} ${after}`;
    const template = this._templates?.[this._config.template as string];
    const count = advancedCount(this._config, template);
    const written = advancedData(this._config);
    // The chosen mode wins over what is written while the fallback card is still unpicked.
    const data =
      this._onErrorMode && written.on_error_mode !== 'card'
        ? { ...written, on_error_mode: this._onErrorMode }
        : written;
    if (written.on_error_mode === 'card' && this._onErrorMode) this._onErrorMode = undefined;
    const fallback = onErrorCard(this._config);
    const CardSlot = unsafeStatic(CARD_SLOT_TAG);
    return html`
      <ha-expansion-panel outlined class="advanced">
        <span slot="header">
          ${localize('editor.advanced.header', undefined, this.hass)}
          <span class="count">
            ${
              count === 0
                ? ''
                : count === 1
                  ? localize('editor.advanced.count_one', undefined, this.hass)
                  : localize('editor.advanced.count_many', { count }, this.hass)
            }
          </span>
        </span>
        <div class="advanced-body">
          ${before}
          ${this._renderAdvancedForm(
            data,
            withoutFields(
              advancedSchema(this.hass, this._config, template, hasOwnWatch(this._rebuildOnEach(template))),
              hidden.advancedFields,
            ),
            template,
          )}
          ${
            data.on_error_mode === 'card'
              ? staticHtml`<${CardSlot}
                  .hass=${this.hass}
                  .lovelace=${this._lovelace}
                  .value=${fallback}
                  .label=${localize('editor.advanced.fallback_label', undefined, this.hass)}
                  .emptyHint=${localize('editor.advanced.fallback_hint', undefined, this.hass)}
                  @value-changed=${this._fallbackChanged}
                ></${CardSlot}>`
              : html``
          }
          ${after}
        </div>
      </ha-expansion-panel>
    `;
  }

  /*
   * The section's form, split after rebuild_on when the card or its template writes
   * something the entity picker cannot draw (#411), so it is listed right under the picker.
   * Both halves hold the whole data, so either one writes back through _advancedChanged.
   */
  private _renderAdvancedForm(
    data: AdvancedData,
    schema: unknown[],
    template: TemplateConfig | undefined,
  ): TemplateResult {
    const form = (entries: unknown[]): TemplateResult =>
      html`<ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${entries}
        .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
        .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
        @value-changed=${this._advancedChanged}
      ></ha-form>`;
    const at = schema.findIndex((entry) => (entry as FormSchemaEntry)?.name === 'rebuild_on');
    const each = at < 0 || !this._config ? [] : this._rebuildOnEach(template);
    const placeholders = new Set(this._config ? rebuildPlaceholders(this._config) : []);
    const mine = each.filter((row) => row.from === 'card' && placeholders.has(row.entry));
    const theirs = each.filter((row) => row.from === 'template');
    if (!mine.length && !theirs.length) return form(schema);
    // An entry written as `{entity, watch}` (#411) is shown by its entity, and what it watches beside it.
    const text = (row: RebuildOnEntry): string => {
      const entity = rebuildEntryEntity(row.entry);
      return typeof entity === 'string' ? entity : JSON.stringify(row.entry);
    };
    const watches = (row: RebuildOnEntry): string => {
      const watch = isRebuildObject(row.entry) ? row.entry.watch : undefined;
      return watch === undefined
        ? ''
        : localize('editor.advanced.rebuild_on_watches', { parts: watchText(watch) }, this.hass);
    };
    const filled = (row: RebuildOnEntry): string => {
      const entity = rebuildEntryEntity(row.entry);
      if (!isRebuildPlaceholder(entity)) return '';
      if (row.entities.length)
        return localize('editor.advanced.rebuild_on_now', { value: row.entities.join(', ') }, this.hass);
      // Left as written, the placeholder has no value to fill in yet.
      const asWritten = isRebuildObject(row.entry) ? JSON.stringify(row.entry) : row.entry;
      if (row.rejects.length && !(row.rejects.length === 1 && row.rejects[0] === asWritten))
        return localize('editor.advanced.rebuild_on_not_entity', { value: row.rejects.join(', ') }, this.hass);
      return localize('editor.advanced.rebuild_on_nothing', undefined, this.hass);
    };
    const notes = (row: RebuildOnEntry): string => [filled(row), watches(row)].filter(Boolean).join(', ');
    return html`${form(schema.slice(0, at + 1))}
      <div class="rebuild-extra">
        ${
          mine.length
            ? html`<div class="rebuild-label">
                  ${localize(
                    mine.some((row) => isRebuildObject(row.entry))
                      ? 'editor.advanced.rebuild_on_written'
                      : 'editor.advanced.rebuild_on_placeholders',
                    undefined,
                    this.hass,
                  )}
                </div>
                <ul class="rebuild-list">
                  ${mine.map(
                    (row) =>
                      html`<li>
                        <code>${text(row)}</code>
                        <span class="rebuild-filled">${notes(row)}</span>
                        <ha-icon-button
                          class="rebuild-remove"
                          .path=${REMOVE_PATH}
                          .label=${localize('editor.advanced.rebuild_on_remove', { entry: text(row) }, this.hass)}
                          title=${localize('editor.advanced.rebuild_on_remove', { entry: text(row) }, this.hass)}
                          data-entry=${text(row)}
                          @click=${(): void => this._removeRebuildEntry(row.entry)}
                        ></ha-icon-button>
                      </li>`,
                  )}
                </ul>`
            : html``
        }
        ${
          theirs.length
            ? html`<p class="rebuild-template">
                ${localize(
                  'editor.advanced.rebuild_on_template',
                  {
                    entries: theirs.map((row) => (notes(row) ? `${text(row)} (${notes(row)})` : text(row))).join(', '),
                  },
                  this.hass,
                )}
              </p>`
            : html``
        }
      </div>
      ${at + 1 < schema.length ? form(schema.slice(at + 1)) : html``}`;
  }

  private _removeRebuildEntry(entry: unknown): void {
    if (!this._config) return;
    fireEvent(this, 'config-changed', { config: withoutRebuildEntry(this._config, entry) });
  }

  private _advancedChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const value = ev.detail.value as AdvancedData;
    // "A card of my choosing" writes nothing until a card is picked; remember it was chosen.
    this._onErrorMode = value.on_error_mode === 'card' && !onErrorCard(this._config) ? 'card' : undefined;
    fireEvent(this, 'config-changed', { config: applyAdvanced(this._config, value) });
  }

  private _fallbackChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    if (ev.detail.value) this._onErrorMode = undefined;
    fireEvent(this, 'config-changed', { config: withOnErrorCard(this._config, ev.detail.value) });
  }

  /*
   * Idea 17: the card shown when a repeat matches nothing was a box of YAML. It is a slot
   * now, with Home Assistant's own card picker behind it, and writes `empty:` as before.
   */
  private _renderEmptySlot(repeatable: boolean): TemplateResult {
    if (!this._config || !repeatable) return html``;
    // Only a card that repeats has a "nothing matched" to show instead (round 1 note).
    const repeats =
      this._config.for_each !== undefined ||
      this._config.for_each_from !== undefined ||
      this._config.empty !== undefined;
    if (!repeats) return html``;
    const CardSlot = unsafeStatic(CARD_SLOT_TAG);
    const empty = this._config.empty;
    return staticHtml`<${CardSlot}
      .hass=${this.hass}
      .lovelace=${this._lovelace}
      .value=${empty && typeof empty === 'object' ? empty : undefined}
      .label=${localize('editor.empty_label', undefined, this.hass)}
      .emptyHint=${localize('editor.empty_slot_hint', undefined, this.hass)}
      @value-changed=${this._emptyChanged}
    ></${CardSlot}>`;
  }

  private _emptyChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const config = { ...this._config } as DeclutteringCardConfig;
    setOrDelete(config, 'empty', ev.detail.value);
    fireEvent(this, 'config-changed', { config });
  }

  /*
   * Idea 44: a template's examples as presets. Usable at any time, not only for a card that
   * sets nothing yet: picking one fills every declared field it names and keeps the rest,
   * and asks first when it would change a value set by hand. The preset is not stored on the
   * card - the dropdown shows a name only while the values still match one.
   */
  private _renderPresets(template: TemplateConfig | undefined): TemplateResult {
    const options = presetOptions(template);
    if (!options.length || !this._config) return html``;
    const matching = presetMatching(template, this._config.variables);
    const pending = this._presetPending;
    return html`
      <div class="presets">
        <ha-form
          .hass=${this.hass}
          .data=${{ preset: matching === undefined ? '' : String(matching) }}
          .schema=${[
            {
              name: 'preset',
              label: localize('editor.preset.label', undefined, this.hass),
              helper:
                matching === undefined && ownVariables(this._config.variables).length
                  ? localize('editor.preset.none', undefined, this.hass)
                  : localize('editor.preset.helper', undefined, this.hass),
              selector: { select: { mode: 'dropdown', options } },
            },
          ]}
          .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
          .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
          @value-changed=${(ev: CustomEvent): void => this._presetPicked(ev, template)}
        ></ha-form>
        ${
          pending
            ? html`<ha-alert alert-type="warning">
                ${localize(
                  'editor.preset.confirm',
                  { preset: options[pending.index]?.label ?? '', names: pending.names.join(', ') },
                  this.hass,
                )}
                <div class="actions">
                  <ha-button @click=${(): void => this._applyPreset(template, pending.index)}>
                    ${localize('editor.preset.apply_anyway', undefined, this.hass)}
                  </ha-button>
                  <ha-button
                    @click=${(): void => {
                      this._presetPending = undefined;
                    }}
                  >
                    ${localize('editor.preset.keep', undefined, this.hass)}
                  </ha-button>
                </div>
              </ha-alert>`
            : html``
        }
      </div>
    `;
  }

  private _presetPicked(ev: CustomEvent, template: TemplateConfig | undefined): void {
    ev.stopPropagation();
    const picked = ev.detail.value?.preset;
    if (picked === undefined || picked === '' || !this._config) return;
    const index = Number(picked);
    if (!Number.isInteger(index)) return;
    const names = presetConflicts(template, index, this._config.variables);
    if (names.length) {
      this._presetPending = { index, names };
      return;
    }
    this._applyPreset(template, index);
  }

  private _applyPreset(template: TemplateConfig | undefined, index: number): void {
    if (!this._config) return;
    this._presetPending = undefined;
    fireEvent(this, 'config-changed', { config: applyPreset(this._config, template, index) });
  }

  /*
   * Idea 16: `template_by_domain:` as a table of domain to template, writing the same
   * mapping a hand writes. A mapping with a value the table cannot read keeps the alert.
   */
  private _renderByDomain(byDomain: Record<string, string>): TemplateResult {
    if (!this._config) return html``;
    if (!isReadableByDomain(this._config)) {
      return html`<ha-alert alert-type="info">
        ${localize(
          'editor.by_domain_hint',
          {
            templates: Object.entries(byDomain)
              .map(([domain, name]) => `${domain}: ${name}`)
              .join(', '),
          },
          this.hass,
        )}
      </ha-alert>`;
    }
    const { rows: written, fallback } = byDomainRows(this._config);
    // A row just added has no template yet, and the mapping cannot hold it: it lives here
    // until both cells are filled, then it is written like the others (round 1, B3).
    const rows = this._byDomainDraft ?? written;
    const templates = cardTemplateOptions(this._templates ?? {}, this.hass);
    const domains = knownDomains(this.hass);
    const domainOptions = (current: string): { value: string; label: string }[] =>
      [...new Set([current, ...domains])].filter(Boolean).map((value) => ({ value, label: value }));
    const write = (next: typeof rows, nextFallback: string): void => {
      const complete = next.every((row) => row.domain?.trim() && row.template?.trim());
      this._byDomainDraft = complete ? undefined : next;
      fireEvent(this, 'config-changed', {
        config: applyByDomainRows(this._config as DeclutteringCardConfig, next, nextFallback),
      });
    };
    return html`
      <div class="by-domain">
        <h3>${localize('editor.by_domain.header', undefined, this.hass)}</h3>
        <p class="hint">${localize('editor.by_domain.hint', undefined, this.hass)}</p>
        ${rows.map(
          (row, index) => html`
            <div class="bd-row">
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { mode: 'dropdown', custom_value: true, options: domainOptions(row.domain) } }}
                .value=${row.domain}
                .label=${localize('editor.by_domain.domain', undefined, this.hass)}
                @value-changed=${(ev: CustomEvent): void => {
                  ev.stopPropagation();
                  write(
                    rows.map((each, at) => (at === index ? { ...each, domain: String(ev.detail.value ?? '') } : each)),
                    fallback ?? '',
                  );
                }}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { mode: 'dropdown', options: templates } }}
                .value=${row.template}
                .label=${localize('editor.by_domain.template', undefined, this.hass)}
                @value-changed=${(ev: CustomEvent): void => {
                  ev.stopPropagation();
                  write(
                    rows.map((each, at) =>
                      at === index ? { ...each, template: String(ev.detail.value ?? '') } : each,
                    ),
                    fallback ?? '',
                  );
                }}
              ></ha-selector>
              <ha-icon-button
                .path=${'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'}
                .label=${localize('editor.by_domain.remove', { domain: row.domain }, this.hass)}
                @click=${(): void =>
                  write(
                    rows.filter((_, at) => at !== index),
                    fallback ?? '',
                  )}
              ></ha-icon-button>
            </div>
          `,
        )}
        <div class="bd-row">
          <span class="bd-default">${localize('editor.by_domain.anything_else', undefined, this.hass)}</span>
          <ha-selector
            .hass=${this.hass}
            .selector=${{ select: { mode: 'dropdown', options: templates } }}
            .value=${fallback ?? ''}
            .label=${localize('editor.by_domain.template', undefined, this.hass)}
            @value-changed=${(ev: CustomEvent): void => {
              ev.stopPropagation();
              write(rows, String(ev.detail.value ?? ''));
            }}
          ></ha-selector>
          <span class="bd-spacer"></span>
        </div>
        <ha-button
          @click=${(): void => write([...rows, { domain: remainingDomains(domains, rows)[0] ?? '', template: '' }], fallback ?? '')}
        >
          ${localize('editor.by_domain.add', undefined, this.hass)}
        </ha-button>
      </div>
    `;
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

  /*
   * The copies a registry repeat would build, for the preview (round 1, B5): the first one
   * stands for all of them, as for a hand-written list. Nothing until a Jinja source has
   * rendered, and nothing when the source cannot be read - the matches line says why.
   */
  private _registryItemsForPreview(): unknown[] | undefined {
    const source = this._config?.for_each_from;
    if (!this.hass || !isRegistrySource(source)) return undefined;
    const template = sourceTemplate(source);
    if (template !== undefined && !Object.prototype.hasOwnProperty.call(this._renderedTemplates, template)) {
      return undefined;
    }
    try {
      const matched = resolveRegistryItems(this.hass, source, {
        ...sourceContext(this._lovelace),
        rendered: this._renderedTemplates,
      });
      return matched.length ? matched : undefined;
    } catch {
      return undefined;
    }
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
  // What the paused preview says: why it paused, when a slow build did it by itself (#456).
  private _pausedText(): string {
    const slow = previewSlowPause();
    return slow !== undefined
      ? localize('card.preview_paused_slow', { ms: slow }, this.hass)
      : localize('card.preview_paused', undefined, this.hass);
  }

  // The Result's build itself, with how long it took (#430: kept by _renderResult).
  private _buildResult(
    variables: VariablesConfig[] | undefined,
    template: TemplateConfig,
    templateName: string | undefined,
    thingType: NonNullable<ReturnType<typeof getThingType>>,
  ): { resolved: unknown; unresolved: string[]; time: string } | { error: string } {
    const content = thingContent(template);
    const unresolved: string[] = [];
    const started = performance.now();
    try {
      // Quietly: the editor re-renders on every keystroke, and the card itself already
      // says what it could not resolve when it renders for real.
      // A state the card rebuilds on is read as it stands now, as the card itself would.
      const scoped = withStateScope(this.hass, this._rebuildOnFor(template));
      // With the dashboard's item templates, as the card has them, so a `with:` or `repeat:`
      // of one is filled in here too rather than shown as written.
      const ll = this._lovelace ?? getLovelaceConfig();
      const resolved = applyOverride(
        deepReplace(
          variables,
          template,
          content,
          templateName,
          scoped,
          true,
          (names) => unresolved.push(...names),
          0,
          undefined,
          undefined,
          false,
          {
            itemTemplates: itemTemplatesOf(ll),
            context: sourceContext(ll),
          },
        ),
        this._config,
        thingType,
      );
      const finished = performance.now();
      // The Result is the editor's own preview: as slow a build here pauses both (#456).
      notePreviewBuild(finished - started);
      return { resolved, unresolved, time: buildTime(started, finished) };
    } catch (err) {
      return { error: String(err) };
    }
  }

  private _renderResult(named: TemplateConfig | undefined, leftOut = false): TemplateResult {
    this._resultNeeded = [];
    if (!this._config) return html``;
    // for_each renders the same template once per item, so one copy stands for all of
    // them - showing every copy would bury the thing you opened this to look at.
    const items = forEachItems(this._config.for_each) ?? this._registryItemsForPreview();
    // A card's `slots:` are variables like any other to what it builds (idea 35).
    const own = withSlotVariables(this._config).variables as VariablesConfig[] | undefined;
    let variables = items?.length ? forEachVariables(items[0], own, 0, items.length) : own;
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

    const paused = previewPauseOn();
    // Built anyway with Render now: shown as it is until the next edit.
    const anyway = this._builtAnyway === this._config;
    // #430: while the preview is paused nothing is built for it at all, Render now aside.
    const held = paused && !anyway;

    /*
     * #430: kept until something the build reads changes. Copies from the registry and a
     * template chosen by domain come from hass rather than the config, so for those what
     * they came to is part of the key.
     */
    const fromHass = isRegistrySource(this._config.for_each_from) || !!byDomainOf(this._config);
    const key = this._readsKey(template, templateName, fromHass ? JSON.stringify(variables) : '');
    /*
     * Typing builds nothing for the Result until the typing stops: the last one is shown
     * until then. Only the Result waits - the fields are drawn now, so none of them is
     * rebuilt under the cursor (#255).
     */
    type Built = ReturnType<DeclutteringCardEditor['_buildResult']>;
    const waiting =
      !held && !anyway && !this._resultDue && !this._builds.holds('result', key) && !!this._builds.last('result');
    if (waiting) {
      clearTimeout(this._resultTimer);
      this._resultTimer = setTimeout(() => {
        this._resultTimer = undefined;
        this._resultDue = true;
        this.requestUpdate();
      }, RESULT_WAIT_MS);
    }
    this._resultDue = false;
    const built: Built | undefined = held
      ? undefined
      : waiting
        ? this._builds.last<Built>('result')
        : this._builds.get('result', key, () =>
            this._buildResult(variables, template as TemplateConfig, templateName, thingType),
          );
    if (built && 'error' in built) {
      return html`<ha-alert alert-type="warning">
        ${localize('editor.result_error', { error: built.error }, this.hass)}
      </ha-alert>`;
    }
    const resolved = built?.resolved;
    const unresolved = built?.unresolved ?? [];

    const copies = items?.length ? localize('editor.result_copies', { total: items.length }, this.hass) : '';
    // Translated whole, then split so the [[name]] in the middle can be set in code.
    const [hintBefore, hintAfter] = splitAt(localize('editor.result_hint', { kind: thingType }, this.hass), '[[name]]');

    /*
     * Idea 19: live, at the top, as the card or as YAML with the line the last edit changed
     * lit. The marks are kept until the next change, so a state update does not wipe them.
     */
    const yaml = held ? (this._lastYaml ?? '') : toYaml(resolved);
    if (!held && yaml !== this._lastYaml) {
      this._markedLines = previewLines(this._lastYaml, yaml);
      this._lastYaml = yaml;
    }
    /*
     * A card being edited in a section is drawn there on the section's grid, and a group
     * lays its cards out side by side only when it is told so - drawn without it, the
     * Rendered view stacked them full width while the dashboard did not (#387).
     */
    const layout = this._editingPlace().section !== undefined ? 'grid' : undefined;
    const modes = previewModes(thingType);
    const mode: PreviewMode = modes.includes(this._previewMode) ? this._previewMode : 'yaml';
    /*
     * Not as a section strategy's options (#400): Home Assistant writes what the editor
     * fires as the section's strategy, so the built card landed there as a strategy type
     * that does not exist, and the section broke.
     */
    const canEject =
      !held &&
      !items?.length &&
      !isRegistrySource(this._config.for_each_from) &&
      resolved &&
      typeof resolved === 'object' &&
      !inSectionStrategyEditor(this);
    const needed = items?.length || held ? [] : requiredUnset(getDeclarations(template), unresolved);
    this._resultNeeded = needed;
    // `editor_hide: preview` (#488): still built, so a held preview is still said at the top.
    if (leftOut) return html``;
    const copiesLine = html`<span class="preview-title" slot="header"
      >${localize('editor.preview.header', undefined, this.hass)}${copies}</span
    >`;
    /*
     * #488: folded, only the header row is drawn - nothing inside is made, so a Rendered view
     * builds no card while it cannot be seen.
     */
    const panel = (body: TemplateResult): TemplateResult =>
      html`<ha-expansion-panel
        outlined
        class="preview"
        .expanded=${this._resultOpen}
        @expanded-will-change=${this._resultToggled}
        @expanded-changed=${this._resultToggled}
        >${copiesLine}${body}</ha-expansion-panel
      >`;
    if (!this._resultOpen) return panel(html``);

    return panel(html`
      <div class="preview-body">
        ${
          modes.length > 1
            ? html`<div class="segmented" role="group">
                ${modes.map(
                  (each) =>
                    html`<button
                      type="button"
                      class=${each === mode ? 'on' : ''}
                      aria-pressed=${each === mode ? 'true' : 'false'}
                      @click=${(): void => {
                        this._previewMode = each;
                      }}
                    >
                      ${localize(`editor.preview.${each}`, undefined, this.hass)}
                    </button>`,
                )}
              </div>`
            : html``
        }
        ${
          mode === 'rendered'
            ? html`<div class="rendered">
                ${
                  !anyway && (paused || needed.length)
                    ? html`<ha-alert alert-type=${paused && previewSlowPause() !== undefined ? 'error' : 'info'}>
                        ${
                          paused
                            ? this._pausedText()
                            : localize(
                                needed.length === 1 ? 'card.preview_required_one' : 'card.preview_required_many',
                                { which: needed.map((name) => `[[${name}]]`).join(', ') },
                                this.hass,
                              )
                        }
                      </ha-alert>`
                    : html`<decluttering-preview-frame
                        .hass=${this.hass}
                        .config=${resolved}
                        .kind=${thingType}
                        .layout=${layout}
                        .renderedOnly=${true}
                        .repeat=${
                          items?.length
                            ? {
                                copies: items.length,
                                max: Number(this._config.columns) || 1,
                                minWidth: Number(this._config.min_column_width) || undefined,
                              }
                            : undefined
                        }
                      ></decluttering-preview-frame>`
                }
              </div>`
            : held
              ? html`<ha-alert alert-type=${previewSlowPause() !== undefined ? 'error' : 'info'}
                  >${this._pausedText()}</ha-alert
                >`
              : html`<pre class="yaml">
${this._markedLines.map((line) => html`<span class="l ${line.changed ? 'changed' : ''}">${line.text}</span>`)}</pre>`
        }
        ${
          built
            ? html`<p class="hint">
                ${localize('editor.preview.built_in', { time: built.time, template: templateName ?? '' }, this.hass)}
                ${mode === 'yaml' ? localize('editor.preview.changed_hint', undefined, this.hass) : ''}
              </p>`
            : html``
        }
        <p class="hint">${hintBefore}<code>[[name]]</code>${hintAfter}</p>
        <div class="preview-actions">
          <ha-button
            title=${localize('editor.preview.pause_helper', undefined, this.hass)}
            @click=${(): void => setPreviewPaused(!paused)}
          >
            ${localize(paused ? 'editor.preview.resume' : 'editor.preview.pause', undefined, this.hass)}
          </ha-button>
          ${
            paused || needed.length
              ? html`<ha-button @click=${(): void => renderPreviewNow()}>
                  ${localize('card.preview_render_now', undefined, this.hass)}
                </ha-button>`
              : html``
          }
          ${
            mode === 'yaml' && !held
              ? html`<ha-button @click=${(): void => this._copyYaml(yaml)}>
                  ${localize(this._copied ? 'editor.preview.copied' : 'editor.preview.copy', undefined, this.hass)}
                </ha-button>`
              : html``
          }
          ${
            /*
             * Leaving should be as clean as arriving: the card becomes exactly what it
             * builds, and the template is out of its life. Only for a single copy - a
             * repeat ejecting to a pile of cards is the template earning its keep.
             */
            canEject
              ? html`
                  <ha-button @click=${(): void => this._eject(resolved)}>
                    ${localize(this._ejectPending ? 'editor.eject_confirm' : 'editor.eject', undefined, this.hass)}
                  </ha-button>
                `
              : html``
          }
        </div>
      </div>
    `);
  }

  // #488: the panel opened or folded by hand. Opened before it measures itself, so it opens to the full height.
  private _resultToggled = (ev: CustomEvent): void => {
    ev.stopPropagation();
    this._resultOpen = !!ev.detail?.expanded;
  };

  /*
   * #488: a held preview said at the top of the editor, whether the panel is folded, open or
   * left out - with the panel's own Resume and Render now. Nothing while nothing is held.
   */
  /*
   * At the top only while paused: a preview held for a required variable is said by the
   * status line under the preview instead, and in full when it is opened (UX pass).
   */
  private _renderHeld(): TemplateResult {
    return previewPauseOn() ? this._renderHeldAlert(true) : html``;
  }

  private _renderHeldAlert(paused: boolean): TemplateResult {
    const needed = this._resultNeeded;
    if (!paused && !needed.length) return html``;
    return html`<ha-alert
      class="preview-held"
      alert-type=${paused && previewSlowPause() !== undefined ? 'error' : 'info'}
    >
      ${
        paused
          ? this._pausedText()
          : localize(
              needed.length === 1 ? 'card.preview_required_one' : 'card.preview_required_many',
              { which: needed.map((name) => `[[${name}]]`).join(', ') },
              this.hass,
            )
      }
      <div class="actions">
        ${
          paused
            ? html`<ha-button
                title=${localize('editor.preview.pause_helper', undefined, this.hass)}
                @click=${(): void => setPreviewPaused(false)}
              >
                ${localize('editor.preview.resume', undefined, this.hass)}
              </ha-button>`
            : html``
        }
        <ha-button @click=${(): void => renderPreviewNow()}>
          ${localize('card.preview_render_now', undefined, this.hass)}
        </ha-button>
      </div>
    </ha-alert>`;
  }

  private _copyYaml(yaml: string): void {
    void copyText(yaml).then((ok) => {
      this._copied = ok;
      if (ok) setTimeout(() => (this._copied = false), 1500);
    });
  }

  /* ------------------------------------------------------------ idea 20: the way to the template and back */

  private _renderResume(): TemplateResult {
    const ticket = this._resume;
    if (!ticket) return html``;
    return html`<ha-alert alert-type="info">
      ${localize('editor.link.resume', { template: ticket.template }, this.hass)}
      <div class="actions">
        <ha-button
          @click=${(): void => {
            this._resume = undefined;
            fireEvent(this, 'config-changed', { config: ticket.config as DeclutteringCardConfig });
          }}
        >
          ${localize('editor.link.resume_button', undefined, this.hass)}
        </ha-button>
        <ha-button
          @click=${(): void => {
            this._resume = undefined;
          }}
        >
          ${localize('editor.link.discard_button', undefined, this.hass)}
        </ha-button>
      </div>
    </ha-alert>`;
  }

  /*
   * Closes this dialog and opens the template card's. Home Assistant edits one card at a
   * time, so the card's unsaved changes are kept and offered again when it is opened next.
   */
  private _openTemplate(name: string): void {
    const panel = getLovelacePanel();
    const path = templateCardPath(panel?.config ?? this._lovelace, name);
    if (!panel || !path) {
      this._cannotOpen = true;
      return;
    }
    if (this._config) {
      stashReturn({
        config: this._config as Record<string, unknown>,
        openedWith: this._openedWith as Record<string, unknown> | undefined,
        template: name,
      });
    }
    const original = cardAtPath(panel.config, path);
    const root = document.querySelector('home-assistant') ?? document.body;
    const open = (): void => {
      fireEvent(root as HTMLElement, 'show-dialog', {
        dialogTag: 'hui-dialog-edit-card',
        dialogImport: () => Promise.resolve(),
        dialogParams: {
          lovelaceConfig: panel.config,
          // Home Assistant 2025 and later edit a card by its config and a saver for it.
          cardConfig: original,
          saveCardConfig: (config: Record<string, unknown>) =>
            panel.saveConfig(original ? replaceCard(panel.config, original, config) : panel.config),
          // Earlier ones by its path on the dashboard.
          saveConfig: (config: unknown) => panel.saveConfig(config),
          path,
        },
      });
    };
    /*
     * One edit dialog at a time: it has to be closed before it is shown again, and with
     * unsaved changes closing first asks whether to leave - so the template opens once the
     * dialog says it has closed, and not at all if the answer was to stay (round 1, B6).
     */
    const dialog = editDialogOf(this) as
      | (Element & {
          closeDialog?: () => boolean | void;
          _discardDirtyStateChanges?: () => void;
          _dirty?: boolean;
        })
      | undefined;
    if (!dialog) {
      open();
      return;
    }
    /*
     * The unsaved change is already kept for "Bring them back", so the dialog has nothing to
     * ask about: without this Home Assistant 2026.7's dialog stops on "Stay or leave?" and
     * the template never opens (round 2, idea 20). Older dialogs kept the flag as _dirty.
     */
    if (this._config) {
      dialog._discardDirtyStateChanges?.();
      if ('_dirty' in dialog) dialog._dirty = false;
    }
    let opened = false;
    const once = (): void => {
      if (opened) return;
      opened = true;
      setTimeout(open, 0);
    };
    dialog.addEventListener('dialog-closed', once, { once: true });
    const closedNow = dialog.closeDialog?.();
    // A dialog that closed without saying so - an older one - is not waited on for ever.
    if (closedNow !== false) setTimeout(once, 400);
  }

  /*
   * Idea 21: the template dropdown as a combo box. Typing filters by name and description;
   * each row is the name, its description, and how many cards use it; the categories and
   * the borrowed templates' dashboards open as headings on the first row of each.
   */
  private _renderTemplatePicker(error: string | string[] | undefined): TemplateResult {
    if (!this._config || !this._templates) return html``;
    if (this._pickerFor !== this._templates || this._pickerCurrent !== this._config.template) {
      this._pickerFor = this._templates;
      this._pickerCurrent = this._config.template;
      this._pickerItems = pickerItems(this._templates, this._lovelace, this.hass, borrowedFrom, this._config.template);
    }
    const shown = filterPickerItems(this._pickerItems, this._pickerFilter);
    const renderer = (item: PickerItem, model: { index: number }): TemplateResult => {
      const heading = groupHeading(item, shown[model.index - 1], this.hass);
      return html`
        <div class="pick-row">
          ${heading ? html`<div class="pick-heading">${heading}</div>` : html``}
          <div class="pick-name">
            <span>${item.label}</span>
            <small class=${item.count === 0 ? 'unused' : ''}>${countText(item.count, this.hass)}</small>
          </div>
          ${item.description ? html`<div class="pick-description">${item.description}</div>` : html``}
        </div>
      `;
    };
    const label = localize('editor.template_label', undefined, this.hass);
    const helper = localize('editor.picker.search', undefined, this.hass);
    const errorText = Array.isArray(error) ? error.join(' ') : (error ?? '');
    /*
     * Three Home Assistants: 2026.7 and later have ha-generic-picker and no ha-combo-box;
     * 2025.7 to 2026.6 have both; before that only ha-combo-box. Each is asked for at render
     * time, as textField() asks for its input, and an installation with neither falls back
     * to the plain dropdown the editor had before (round 1, B1).
     */
    if (isDefinedHere('ha-generic-picker')) {
      const all = this._pickerItems;
      // Drawn inside the picker's own shadow root, where this editor's styles do not reach.
      const rowRenderer = (item: ComboItem): TemplateResult => html`
        <div class="pick-row" style="padding: 6px 16px">
          <div class="pick-name">
            <span>${item.primary}</span>
            <small
              class=${item.secondary?.startsWith(localize('editor.picker.unused', undefined, this.hass)) ? 'unused' : ''}
            >
              ${item.secondary}
            </small>
          </div>
        </div>
      `;
      return html`
        <ha-generic-picker
          class="picker"
          .hass=${this.hass}
          .label=${label}
          .helper=${helper}
          .searchLabel=${helper}
          .value=${this._config.template ?? ''}
          .getItems=${(): (ComboItem | string)[] => pickerList(all, '', this.hass)}
          .searchKeys=${[
            { name: 'primary', weight: 10 },
            { name: 'secondary', weight: 5 },
            { name: 'search', weight: 3 },
          ]}
          .searchFn=${(search: string): (ComboItem | string)[] => pickerList(all, search, this.hass)}
          .rowRenderer=${rowRenderer}
          .invalid=${!!error}
          .errorMessage=${errorText}
          allow-custom-value
          no-sort
          @value-changed=${this._templatePicked}
        ></ha-generic-picker>
      `;
    }
    if (!isDefinedHere('ha-combo-box')) {
      // Neither picker: the dropdown the editor always had, with a typed name still allowed.
      return html`
        <ha-selector
          class="picker"
          .hass=${this.hass}
          .label=${label}
          .selector=${{
            select: {
              mode: 'dropdown',
              custom_value: true,
              options: this._pickerItems.map((item) => ({ value: item.value, label: item.label })),
            },
          }}
          .value=${this._config.template ?? ''}
          @value-changed=${this._templatePicked}
        ></ha-selector>
        ${error ? html`<ha-alert alert-type="error">${errorText}</ha-alert>` : html``}
      `;
    }
    return html`
      <ha-combo-box
        class="picker"
        .hass=${this.hass}
        .label=${localize('editor.template_label', undefined, this.hass)}
        .helper=${localize('editor.picker.search', undefined, this.hass)}
        .items=${this._pickerItems}
        .filteredItems=${shown}
        .value=${this._config.template ?? ''}
        .renderer=${renderer}
        .invalid=${!!error}
        .errorMessage=${Array.isArray(error) ? error.join(' ') : (error ?? '')}
        item-value-path="value"
        item-label-path="value"
        allow-custom-value
        @filter-changed=${(ev: CustomEvent): void => {
          ev.stopPropagation();
          this._pickerFilter = String(ev.detail?.value ?? '');
        }}
        @value-changed=${this._templatePicked}
      ></ha-combo-box>
    `;
  }

  /* ------------------------------------------------------------ the first run */

  // The templates this card could pick: base templates are only ever extended, never picked.
  private _pickable(): string[] {
    return Object.keys(this._templates ?? {}).filter((name) => !isBaseTemplate((this._templates ?? {})[name]));
  }

  /*
   * A card with no template yet, on a dashboard with none to pick: what a template is, a way
   * to start from the starter library, and a way to write one. With templates to pick, the
   * picker above is the whole of it.
   */
  private _renderFirstRun(): TemplateResult {
    if (!this._config || this._loadingTemplates || this._pickable().length) return this._renderCardGallery();
    // Turning this card into a template card only works where a card can change type.
    const canCreate = !!editDialogOf(this) && !inSectionStrategyEditor(this);
    const starters = this._galleryEntries().filter((entry) => entry.source === 'library' && entry.kind === 'card');
    return html`
      <div class="first-run">
        <div class="first-run-empty">
          <ha-icon icon="mdi:view-dashboard-outline" aria-hidden="true"></ha-icon>
          <h3>${localize('editor.first_run.empty_title', undefined, this.hass)}</h3>
          <p class="hint">${localize('editor.first_run.empty_hint', undefined, this.hass)}</p>
          <div class="actions">
            <ha-button appearance="filled" @click=${(): void => void (this._galleryOpen = true)}>
              ${localize('gallery.open', undefined, this.hass)}
            </ha-button>
            ${
              canCreate
                ? html`<ha-button appearance="outlined" @click=${this._createTemplate}>
                    ${localize('editor.first_run.create', undefined, this.hass)}
                  </ha-button>`
                : html``
            }
          </div>
        </div>
        ${
          starters.length
            ? html`<ha-expansion-panel outlined expanded class="first-run-starters">
                <span slot="header">${localize('share.library_header', undefined, this.hass)}</span>
                <div class="starters">
                  ${starters.map(
                    (entry) =>
                      html`<button
                        type="button"
                        class="starter"
                        .disabled=${this._installing}
                        title=${localize('editor.first_run.use', { name: entry.name }, this.hass)}
                        @click=${(): void => void this._useLibrary(entry.name)}
                      >
                        <span class="starter-name">${entry.title}</span>
                        <span class="starter-about">${entry.description}</span>
                        <small
                          >${
                            entry.variables === 1
                              ? localize('gallery.variables_one', undefined, this.hass)
                              : localize('gallery.variables_many', { count: entry.variables }, this.hass)
                          }</small
                        >
                      </button>`,
                  )}
                </div>
              </ha-expansion-panel>`
            : html``
        }
        ${this._installError ? html`<ha-alert alert-type="error">${this._installError}</ha-alert>` : html``}
      </div>
      ${this._renderCardGallery()}
    `;
  }

  // "Create a template": this card becomes a template card, and the dialog opens its editor.
  private _createTemplate = (): void => {
    fireEvent(this, 'config-changed', {
      config: newTemplateCard(Object.keys(this._templates ?? {})) as unknown as DeclutteringCardConfig,
    });
  };

  private _galleryEntries(): GalleryEntry[] {
    return galleryEntries(
      { library: LIBRARY, installed: collectTemplates(this._lovelace) },
      (name) => localize(`library.${name}.summary`, undefined, this.hass),
      this.hass,
    );
  }

  // What a gallery tile means for this dashboard. Installs land in decluttering_templates, which keeps the view as it is.
  private _galleryStatus(entry: GalleryEntry | undefined): GalleryStatus {
    const existing = Object.keys(collectTemplates(this._lovelace));
    const library = entry?.source === 'library' ? libraryEntry(entry.name) : undefined;
    const needs = library ? libraryNeeds(library, existing) : [];
    return {
      already: !!entry && (entry.source === 'installed' || existing.includes(entry.name)),
      armed: false,
      busy: this._installing,
      needs,
      brings: [],
      missingCards: library
        ? missingCustomCards(
            [library.template, ...needs.map((each) => libraryEntry(each)?.template)].filter(
              (each) => each !== undefined,
            ),
            isDefinedHere,
          )
        : [],
      risks: [],
      destination: 'root',
      communityLoaded: false,
      communityLoading: false,
    };
  }

  // Made once, as the template editor's is: made again, its ha-dialog closes on the first click.
  private _galleryDialog?: HTMLElement & Record<string, unknown>;

  private _renderCardGallery(): TemplateResult {
    if (!this._galleryOpen) return html``;
    const entries = this._galleryEntries();
    if (!this._galleryDialog) {
      // By tag name: the dialog's class is in this same editors chunk.
      const dialog = document.createElement(GALLERY_TAG) as HTMLElement & Record<string, unknown>;
      dialog.addEventListener('gallery-closed', () => {
        this._galleryOpen = false;
      });
      dialog.addEventListener('gallery-select', (ev) => {
        this._gallerySelected = (ev as CustomEvent).detail?.key;
      });
      dialog.addEventListener('gallery-install', (ev) => {
        const entry = this._galleryEntries().find((each) => each.key === (ev as CustomEvent).detail?.key);
        if (entry?.source === 'library') void this._useLibrary(entry.name);
      });
      this._galleryDialog = dialog;
    }
    const dialog = this._galleryDialog;
    dialog.hass = this.hass;
    dialog.entries = entries;
    // The shared store needs the template editor's checks before an install: it is browsed from there.
    dialog.sources = ['library', 'installed'];
    dialog.open = true;
    dialog.selectedKey = this._gallerySelected;
    dialog.status = this._galleryStatus(entries.find((entry) => entry.key === this._gallerySelected));
    return html`${dialog}`;
  }

  /*
   * A starter template put on the dashboard and picked for this card in one go. Saved through
   * the one place every rewrite goes, so the toast can undo it; the dialog's copy of the
   * dashboard is not brought up to date by Home Assistant, so the editor reads it again.
   */
  private async _useLibrary(name: string): Promise<void> {
    if (!this._config || this._installing) return;
    const before = this._config;
    const existing = Object.keys(collectTemplates(getLovelacePanel()?.config ?? this._lovelace));
    this._installError = undefined;
    if (!existing.includes(name)) {
      if (!getLovelacePanel()) {
        this._installError = localize('tools.cannot_save_here', undefined, this.hass);
        return;
      }
      this._installing = true;
      try {
        await rewriteDashboards(
          this,
          this.hass,
          'library_install',
          [{ urlPath: pageDashboard(), build: (config) => withLibraryInstalled(config, name, existing, VERSION) }],
          editDialogOf(this) ? before : undefined,
        );
      } catch (err) {
        this._installError = localize('tools.save_failed', { message: (err as Error)?.message ?? err }, this.hass);
        return;
      } finally {
        this._installing = false;
      }
      const saved = getLovelacePanel()?.config;
      if (saved) this.lovelace = saved;
      this._keepOnDialogSave(name);
    }
    this._galleryOpen = false;
    fireEvent(this, 'config-changed', { config: { ...this._config, template: name } as DeclutteringCardConfig });
  }

  /*
   * The edit dialog saves this card into the dashboard as the dialog first had it, which would
   * take the template just installed away again. Its save is wrapped to put it back, and the
   * copy older dialogs build from is brought up to date.
   */
  private _keepOnDialogSave(name: string): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params = (editDialogOf(this) as any)?._params as Record<string, any> | undefined;
    if (!params) return;
    const panel = getLovelacePanel();
    if (panel?.config && params.lovelaceConfig) params.lovelaceConfig = panel.config;
    if (typeof params.saveCardConfig !== 'function') return;
    params.saveCardConfig = keepingTemplates(
      params.saveCardConfig,
      name,
      () => getLovelacePanel(),
      (ll) => Object.keys(collectTemplates(ll as LovelaceConfig)),
      VERSION,
    );
  }

  private _templatePicked(ev: CustomEvent): void {
    ev.stopPropagation();
    const value = ev.detail?.value;
    if (typeof value !== 'string' || !value || !this._config || value === this._config.template) return;
    this._pickerFilter = '';
    fireEvent(this, 'config-changed', { config: { ...this._config, template: value } as DeclutteringCardConfig });
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
      // Borrowed: the dashboard it comes from is where it is edited (idea 20).
      const from = borrowedFrom(name);
      return html`<p class="hint">
        ${localize('editor.source_borrowed', undefined, this.hass)}
        ${
          from
            ? html`<a href=${dashboardHref(from)} target="_blank" rel="noreferrer"
                >${localize('editor.link.open_dashboard', undefined, this.hass)}</a
              >`
            : html``
        }
      </p>`;
    }
    if (location.declared || !location.view) {
      return html`<p class="hint">
        ${localize('editor.source_declared', undefined, this.hass)}
        ${localize('editor.link.raw_editor', undefined, this.hass)}
      </p>`;
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
      <a
        href="#"
        class="edit-template"
        @click=${(ev: Event): void => {
          ev.preventDefault();
          this._openTemplate(name);
        }}
        >${localize('editor.link.edit_template', undefined, this.hass)}</a
      >
      ${this._cannotOpen ? html`<br />${localize('editor.link.cannot_open', undefined, this.hass)}` : html``}
    </p>`;
  }

  // The card's for_each_from with its placeholders filled in, as the card fills it in (#309).
  private _filledSource(templateConfig: TemplateConfig | undefined): unknown {
    return fillSource(this._config?.for_each_from, this._config?.variables, templateConfig, this.hass);
  }

  /*
   * A template source's copies can be mappings of anything, so the names they supply are
   * only known once it has rendered - read from what it rendered, when it has, so those
   * names are not reported as missing.
   */
  private _renderedTemplateNames(templateConfig: TemplateConfig): string[] {
    const source = this._filledSource(templateConfig);
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
  private _renderMatches(templateConfig: TemplateConfig | undefined): TemplateResult {
    if (!this.hass || !isRegistrySource(this._config?.for_each_from)) return html``;
    const source = this._filledSource(templateConfig);

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

    // What the sweep matched but Home Assistant hides or files as config or diagnostic (#452).
    const left = entitiesLeftOut(this.hass, source);
    const leftOut = left ? leftOutParams(left, this.hass) : undefined;

    if (!matched.length) {
      const but = this._config?.empty ? localize('editor.matches_none_but_empty', undefined, this.hass) : '';
      return html`<ha-alert alert-type="warning">
        ${localize(leftOut ? 'editor.matches_none_left_out' : 'editor.matches_none', { but, ...leftOut }, this.hass)}
      </ha-alert>`;
    }

    // The names, not the whole mappings: it is a sanity check on the filters, not a data
    // dump, and a sweep of the house should not fill the dialog.
    const shown = matched.slice(0, MATCHES_SHOWN);

    // The count sits beside the filters that change it (idea 15); the list is a click away.
    return html`
      <div class="matches-line">
        <ha-svg-icon .path=${'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z'}></ha-svg-icon>
        <span>
          ${
            matched.length === 1
              ? localize('editor.matches_header_one', { what: matchedWhat(source, 1, this.hass) }, this.hass)
              : localize(
                  'editor.matches_header_many',
                  { count: matched.length, what: matchedWhat(source, matched.length, this.hass) },
                  this.hass,
                )
          }
        </span>
        <ha-button
          @click=${(): void => {
            this._matchesOpen = !this._matchesOpen;
          }}
        >
          ${localize(this._matchesOpen ? 'editor.repeat.matches_hide' : 'editor.repeat.matches_show', undefined, this.hass)}
        </ha-button>
      </div>
      ${leftOut ? html`<p class="hint">${localize('editor.matches_left_out', leftOut, this.hass)}</p>` : html``}
      ${
        this._matchesOpen
          ? html`<div class="matches">
              <ul>
                ${shown.map((item, index) => html`<li>${copyLabel(item, index)}</li>`)}
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
            </div>`
          : html``
      }
    `;
  }

  /** The names every copy of a repeat is given, which the form shows greyed and the diagnostics count as set. */
  private _suppliedNames(template: TemplateConfig | undefined): string[] {
    return [
      ...forEachNames(this._config?.for_each),
      ...registryNames(this._config?.for_each_from),
      ...(isRegistrySource(this._config?.for_each_from) ? POSITION_NAMES : []),
      ...(template ? this._renderedTemplateNames(template) : []),
    ];
  }

  /*
   * Ideas 15 and 46: the repeat, as a form. One dropdown says what a copy is made for; the
   * fields under it are the filters that collection takes, with the live match count beside
   * them; a hand-written list is a list that can be put in order; a shape the form cannot
   * draw keeps its YAML.
   */
  private _renderRepeat(repeatable: boolean, template: TemplateConfig | undefined): TemplateResult {
    if (!this._config || !repeatable) return html``;
    const mode = repeatMode(this._config);
    const modeSchema = [
      {
        name: 'mode',
        label: localize('editor.repeat.mode_label', undefined, this.hass),
        helper: localize('editor.repeat.mode_helper', undefined, this.hass),
        selector: { select: { mode: 'dropdown', options: repeatModeOptions(this.hass, mode) } },
      },
    ];
    return html`
      <div class="repeat">
        <h3>${localize('editor.repeat.header', undefined, this.hass)}</h3>
        <ha-form
          .hass=${this.hass}
          .data=${{ mode }}
          .schema=${modeSchema}
          .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
          .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
          @value-changed=${this._repeatModeChanged}
        ></ha-form>
        ${
          mode === 'list'
            ? this._renderRepeatList()
            : mode === 'other'
              ? this._renderOtherSource(template)
              : mode === 'none'
                ? html``
                : this._renderRepeatBuilder(template)
        }
        ${this._renderByDomainSwitch()}
      </div>
    `;
  }

  /*
   * A mapping of domains to templates, started from the form: the switch turns the table on
   * with the card's template as what anything else uses, and off again - asking first, since
   * that drops every row. A mapping the table cannot read keeps the code-editor alert.
   */
  private _renderByDomainSwitch(): TemplateResult {
    if (!this._config) return html``;
    const on = hasByDomain(this._config);
    const schema = [
      {
        name: 'by_domain',
        label: localize('editor.by_domain.switch', undefined, this.hass),
        helper: localize('editor.by_domain.switch_helper', undefined, this.hass),
        selector: { boolean: {} },
      },
    ];
    return html`
      <ha-form
        class="by-domain-switch"
        .hass=${this.hass}
        .data=${{ by_domain: on }}
        .schema=${schema}
        .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
        .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
        @value-changed=${this._byDomainToggled}
      ></ha-form>
      ${
        this._byDomainOffPending && on
          ? html`<ha-alert alert-type="warning" class="by-domain-off">
              ${localize('editor.by_domain.off_confirm', undefined, this.hass)}
              <div class="actions">
                <ha-button
                  @click=${(): void => {
                    this._byDomainOffPending = false;
                    this._byDomainDraft = undefined;
                    fireEvent(this, 'config-changed', { config: stopByDomain(this._config as DeclutteringCardConfig) });
                  }}
                >
                  ${localize('editor.by_domain.off_remove', undefined, this.hass)}
                </ha-button>
                <ha-button
                  @click=${(): void => {
                    this._byDomainOffPending = false;
                  }}
                >
                  ${localize('editor.by_domain.off_keep', undefined, this.hass)}
                </ha-button>
              </div>
            </ha-alert>`
          : html``
      }
      ${on ? this._renderByDomain(byDomainOf(this._config) ?? {}) : html``}
    `;
  }

  private _byDomainToggled(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const wanted = !!ev.detail?.value?.by_domain;
    if (wanted === hasByDomain(this._config)) {
      this._byDomainOffPending = false;
      return;
    }
    if (wanted) {
      this._byDomainOffPending = false;
      fireEvent(this, 'config-changed', { config: startByDomain(this._config) });
      return;
    }
    // Off drops every row, so it is asked first; the switch stays on until the answer.
    this._byDomainOffPending = true;
    this.requestUpdate();
  }

  // How the copies are laid out and where the card sits, under the repeat they belong to.
  private _renderLayout(data: Record<string, unknown>, repeatable: boolean, hidden: EditorHidden): TemplateResult {
    const schema = [...(repeatable ? repeatSchema() : []), ...(hidden.fit ? [] : fitSchema())];
    if (!schema.length) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
        .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _repeatModeChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const mode = ev.detail.value?.mode as RepeatMode | undefined;
    if (!mode) return;
    const config = withRepeatMode(this._config, mode);
    if (config !== this._config) fireEvent(this, 'config-changed', { config });
  }

  private _renderRepeatBuilder(template: TemplateConfig | undefined): TemplateResult {
    const source = this._config?.for_each_from;
    const kind = sourceKind(source);
    if (!kind) return html``;
    const data = repeatData(source);
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${repeatBuilderSchema(this.hass, kind, data)}
        .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
        .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
        @value-changed=${this._repeatBuilderChanged}
      ></ha-form>
      ${this._renderMatches(template)}
    `;
  }

  private _repeatBuilderChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || !isDrawableSource(this._config.for_each_from)) return;
    const config = {
      ...this._config,
      for_each_from: applyRepeat(this._config.for_each_from, ev.detail.value as RepeatData),
    };
    fireEvent(this, 'config-changed', { config });
  }

  // A source the form cannot draw - a Jinja template, a range - is edited as it was written.
  private _renderOtherSource(template: TemplateConfig | undefined): TemplateResult {
    return html`
      <p class="hint">${localize('editor.repeat.other_hint', undefined, this.hass)}</p>
      <ha-yaml-editor
        .hass=${this.hass}
        .defaultValue=${this._config?.for_each_from}
        @value-changed=${this._otherSourceChanged}
      ></ha-yaml-editor>
      ${this._renderMatches(template)}
    `;
  }

  private _otherSourceChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config || ev.detail?.isValid === false) return;
    const config = { ...this._config } as DeclutteringCardConfig;
    setOrDelete(config, 'for_each_from', ev.detail.value);
    fireEvent(this, 'config-changed', { config });
  }

  /* ---------------------------------------------------------- the hand-written list (idea 46) */

  private _listItems(): unknown[] {
    const list = this._config?.for_each;
    if (Array.isArray(list)) return list;
    return list && typeof list === 'object' ? [list] : [];
  }

  private _setList(items: unknown[]): void {
    if (!this._config) return;
    fireEvent(this, 'config-changed', { config: { ...this._config, for_each: items } as DeclutteringCardConfig });
  }

  private _renderRepeatList(): TemplateResult {
    const items = this._listItems();
    const name = (item: unknown, index: number): string =>
      listItemLabel(item) || localize('editor.repeat.list_item', { number: index + 1 }, this.hass);
    const drop = (ev: DragEvent, to: number): void => {
      ev.preventDefault();
      const from = this._dragging;
      this._dragging = undefined;
      if (from !== undefined && from !== to) this._setList(moveItem(items, from, to));
    };
    return html`
      <p class="hint">${localize('editor.repeat.list_hint', undefined, this.hass)}</p>
      <ul class="items">
        ${items.map(
          (item, index) => html`
            <li
              draggable="true"
              @dragstart=${(ev: DragEvent): void => {
                this._dragging = index;
                ev.dataTransfer?.setData('text/plain', name(item, index));
                if (ev.dataTransfer) ev.dataTransfer.effectAllowed = 'move';
              }}
              @dragover=${(ev: DragEvent): void => {
                if (this._dragging !== undefined) ev.preventDefault();
              }}
              @drop=${(ev: DragEvent): void => drop(ev, index)}
              @dragend=${(): void => {
                this._dragging = undefined;
              }}
            >
              <div class="item-row">
                <ha-svg-icon
                  class="handle"
                  role="img"
                  aria-label=${localize('template_editor.drag_hint', undefined, this.hass)}
                  .path=${DRAG_PATH}
                ></ha-svg-icon>
                <span class="item-name">${name(item, index)}</span>
                <span class="spacer"></span>
                <ha-icon-button
                  .path=${'M7,15L12,10L17,15H7Z'}
                  .disabled=${index === 0}
                  .label=${localize('editor.repeat.move_up', { name: name(item, index) }, this.hass)}
                  @click=${(): void => this._setList(moveItem(items, index, index - 1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${'M7,10L12,15L17,10H7Z'}
                  .disabled=${index === items.length - 1}
                  .label=${localize('editor.repeat.move_down', { name: name(item, index) }, this.hass)}
                  @click=${(): void => this._setList(moveItem(items, index, index + 1))}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z'}
                  .label=${localize('editor.repeat.list_edit', { name: name(item, index) }, this.hass)}
                  @click=${(): void => this._toggleItem(index)}
                ></ha-icon-button>
                <ha-icon-button
                  .path=${'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'}
                  .label=${localize('editor.repeat.list_remove', { name: name(item, index) }, this.hass)}
                  @click=${(): void => this._setList(withoutListItem(items, index))}
                ></ha-icon-button>
              </div>
              ${
                this._openItems.has(index)
                  ? html`<ha-yaml-editor
                      .hass=${this.hass}
                      .defaultValue=${item}
                      @value-changed=${(ev: CustomEvent): void => {
                        ev.stopPropagation();
                        if (ev.detail?.isValid === false) return;
                        this._setList(withListItem(items, index, ev.detail.value));
                      }}
                    ></ha-yaml-editor>`
                  : html``
              }
            </li>
          `,
        )}
      </ul>
      <ha-button @click=${(): void => this._setList(withNewListItem(items))}>
        ${localize('editor.repeat.list_add', undefined, this.hass)}
      </ha-button>
    `;
  }

  private _toggleItem(index: number): void {
    const open = new Set(this._openItems);
    if (open.has(index)) open.delete(index);
    else open.add(index);
    this._openItems = open;
  }

  /*
   * The declared variables the editor leaves out for now (#347), read against every value
   * the card will build with - its own, then the view's, then the template's defaults - so
   * a switch left at its default counts as set. Nothing about a hidden variable changes:
   * a value it was given stays, and it is back the moment its condition says so.
   */
  private _hiddenNames(template: TemplateConfig | undefined, declarations: VariableDeclaration[]): Set<string> {
    return this._builds.get('hidden', this._readsKey(template), () => this._hiddenNamesNow(template, declarations));
  }

  private _hiddenNamesNow(template: TemplateConfig | undefined, declarations: VariableDeclaration[]): Set<string> {
    const hidden = new Set<string>();
    // A group's show_if and hide_if (#473) hide each of its fields, so a hidden group leaves no section.
    const groups = templateGroups(template);
    if (!hasVisibilityConditions(declarations, groups)) return hidden;
    const values = variableValues(resolveVariables(this._config?.variables, template));
    // A value written with placeholders is read as the card fills it (#426), with the states
    // it rebuilds on and the dashboard's item templates, as _failedChecks reads them.
    const config = this._config;
    const read = filledReader(values, (content) => {
      if (!config || !template) return content;
      const ll = this._lovelace ?? getLovelaceConfig();
      const scoped = withStateScope(this.hass, this._rebuildOnFor(template));
      const variables = withSlotVariables(config).variables;
      return deepReplace(
        variables,
        template,
        content,
        config.template,
        scoped,
        true,
        undefined,
        0,
        undefined,
        undefined,
        false,
        {
          itemTemplates: itemTemplatesOf(ll),
          context: sourceContext(ll),
        },
      );
    });
    for (const declaration of declarations) {
      if (!declarationShown(declaration, read, groups)) hidden.add(declaration.name);
    }
    return hidden;
  }

  /*
   * A template that describes its variables gets a real control for each one, and a box
   * underneath for anything else the card sets. A template that does not is edited the
   * way it always has been, through that box alone.
   */
  private _formSchema(
    declarations: VariableDeclaration[],
    hidden: EditorHidden,
    template: TemplateConfig | undefined,
  ): unknown[] {
    // With nothing described, the variables field is the only way to set any, so it stays.
    // The template field is the picker above the form (idea 21), so the schema starts after it.
    if (!declarations.length) return this._schema.slice(1);

    // A variable the repeat fills is shown greyed and says so, rather than as an empty
    // field that looks like a mistake (idea 15).
    const supplied = new Set(this._suppliedNames(template));
    const field = (declaration: VariableDeclaration): Record<string, unknown> => {
      const fromCopy = supplied.has(declaration.name);
      return {
        name: VARIABLE_FIELD_PREFIX + declaration.name,
        label: declaration.label ?? declaration.name,
        helper: fromCopy
          ? localize('editor.repeat.from_each_copy_helper', undefined, this.hass)
          : declaration.description,
        // Found options (#404), then a declared selector, then what its `type:` stands for,
        // then its allowed values.
        selector: this._selectorFor(declaration, template),
        required: declaration.required === true && !fromCopy,
        disabled: fromCopy,
      };
    };

    // Declarations sharing a `group:` fold into a collapsible section, so a template with
    // fifteen variables leads with its essentials. `name: ''` keeps the data flat - the
    // section is presentation, not a level in the config.
    // What the template's `groups:` says of each (#473): whether it starts open, and a line
    // under its title.
    const groups = templateGroups(template);
    const grouped: unknown[] = [];
    for (const bucket of groupDeclarations(declarations.filter((declaration) => !isCardDeclaration(declaration)))) {
      if (bucket.group === undefined) {
        grouped.push(...bucket.declarations.map(field));
        continue;
      }
      const settings = groups[bucket.group];
      const description = typeof settings?.description === 'string' ? settings.description : '';
      grouped.push({
        name: '',
        type: 'expandable',
        title: bucket.group,
        ...(settings?.expanded === true ? { expanded: true } : {}),
        ...(description ? { helper: description } : {}),
        schema: bucket.declarations.map(field),
      });
    }

    return [
      ...grouped,
      ...(hidden.extras
        ? []
        : [
            {
              name: 'extras',
              label: localize('editor.extras_label', undefined, this.hass),
              helper: localize('editor.extras_helper', undefined, this.hass),
              selector: { object: {} },
            },
          ]),
    ];
  }

  /** Each rebuild_on entry of the card and its template, with what it fills to now (#411). */
  private _rebuildOnEach(template: TemplateConfig | undefined): RebuildOnEntry[] {
    const ll = this._lovelace ?? getLovelaceConfig();
    return rebuildOnEach(this._config, template, this.hass, {
      itemTemplates: itemTemplatesOf(ll),
      context: sourceContext(ll),
    });
  }

  /** What the card rebuilds on with this template: its own rebuild_on and the template's, filled in (#411). */
  private _rebuildOnFor(template: TemplateConfig | undefined): string[] {
    const ll = this._lovelace ?? getLovelaceConfig();
    // Filled in without reading any state, so the states are not part of what it reads.
    return this._builds.get(
      'rebuild_on',
      buildKey(this.hass, [], this._config, template, ll, libraryRead()),
      () =>
        rebuildOnFor(this._config, template, this.hass, {
          itemTemplates: itemTemplatesOf(ll),
          context: sourceContext(ll),
        }).entities,
    );
  }

  /*
   * #430: everything a build in this editor reads - the card, its template and the others,
   * the dashboard, where the card is on it, the library, and the states of only the entities
   * it rebuilds on. A state changing anywhere else leaves every build as it was.
   */
  private _readsKey(template: TemplateConfig | undefined, ...more: unknown[]): unknown[] {
    const ll = this._lovelace ?? getLovelaceConfig();
    const place = this._editingPlace();
    return buildKey(
      this.hass,
      this._rebuildOnFor(template),
      this._config,
      template,
      this._templates,
      ll,
      place.view,
      place.section,
      libraryRead(),
      typeof window === 'undefined' ? '' : window.location.pathname,
      ...more,
    );
  }

  /*
   * #255: the variables form. A template that declares nothing keeps the one form. One that
   * declares variables gets a form per field - each handed the whole data, so a change comes
   * back to _valueChanged exactly as it did from the single form - which gives every field a
   * place for its Reset. A field is drawn the same way whether it has a Reset or not, so the
   * button coming and going as the field is typed in never rebuilds the field under the cursor.
   */
  private _renderVariablesForm(
    data: Record<string, unknown>,
    shown: VariableDeclaration[],
    hidden: EditorHidden,
    template: TemplateConfig | undefined,
    error: Record<string, string | string[]>,
    // Required variables with no value: each says, under its field, which template wants it.
    needed: string[] = [],
  ): TemplateResult {
    const resets = this._resetTargets(shown, template);
    const schema = this._formSchema(shown, hidden, template) as SchemaEntry[];
    const form = (entries: unknown[]): TemplateResult =>
      html`<ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${entries}
        .error=${error}
        .computeLabel=${(s: FormSchemaEntry): string => s.label ?? s.name}
        .computeHelper=${(s: FormSchemaEntry): string => s.helper ?? ''}
        @value-changed=${this._valueChanged}
        @focusout=${this._sendUnsent}
        @keydown=${this._enterSends}
      ></ha-form>`;
    if (!shown.length) return form(schema);

    const field = (entry: SchemaEntry): TemplateResult => {
      if (typeof entry.name !== 'string' || !entry.name.startsWith(VARIABLE_FIELD_PREFIX)) return form([entry]);
      const name = entry.name.slice(VARIABLE_FIELD_PREFIX.length);
      const reset = entry.disabled ? undefined : resets.get(name);
      /*
       * A field that could have a Reset keeps its place, set or not, so the first keystroke in
       * an unset field only puts the button into a place already there and the field keeps its
       * width. A field that never can has no place, so it gets the width back on a phone.
       */
      return html`<div class="declared-field">
        ${form([entry])}
        ${
          needed.includes(name)
            ? html`<div class="required-line" data-required=${name}>
                ${localize('editor.variables.required_by', { template: this._config?.template ?? '' }, this.hass)}
              </div>`
            : html``
        }
        ${this._defaultLine(name, defaultLine(reset, hidden.defaults))} ${this._leftBehindNote(name, template)}
        ${
          hasResetSlot(reset, entry.disabled)
            ? html`<span class="reset-slot"
                >${
                  reset?.set
                    ? html`<ha-icon-button
                        class="reset"
                        .path=${RESET_PATH}
                        .label=${localize('editor.default.reset', { name: entry.label ?? name }, this.hass)}
                        title=${localize('editor.default.reset', { name: entry.label ?? name }, this.hass)}
                        data-variable=${name}
                        @click=${(): void => this._resetVariable(name)}
                      ></ha-icon-button>`
                    : html``
                }</span
              >`
            : html``
        }
      </div>`;
    };
    const key = (entry: SchemaEntry): string =>
      entry.type === 'expandable' ? `group:${entry.title ?? ''}` : String(entry.name);
    return html`<div class="declared">
      ${repeat(schema, key, (entry) =>
        entry.type === 'expandable'
          ? html`<ha-expansion-panel
              outlined
              class="declared-group"
              .header=${entry.title ?? ''}
              .secondary=${entry.helper ?? ''}
              .expanded=${this._openGroups.get(entry.title ?? '') ?? entry.expanded === true}
              @expanded-changed=${(ev: CustomEvent): void => this._groupToggled(entry.title ?? '', ev)}
            >
              <div class="declared-group-body">${repeat(entry.schema ?? [], key, field)}</div>
            </ha-expansion-panel>`
          : field(entry),
      )}
    </div>`;
  }

  /*
   * #483: what a set field would go back to, on a line of its own under the field rather than
   * run into its description, with the value picked out so it reads apart from the words.
   */
  private _defaultLine(name: string, line: { key: string; value: string } | undefined): TemplateResult {
    if (!line) return html``;
    const [before, after = ''] = localize(line.key, { value: '\u0000' }, this.hass).split('\u0000');
    return html`<div class="default-line" data-default=${name}>
      ${before}<span class="default-value">${line.value}</span>${after}
    </div>`;
  }

  private _groupToggled(title: string, ev: CustomEvent): void {
    ev.stopPropagation();
    const open = new Map(this._openGroups);
    open.set(title, !!ev.detail?.expanded);
    this._openGroups = open;
  }

  /*
   * #255: each shown field that something else would give a value to, with that value as
   * text - a computed default worked out from what the card holds - and the place it is
   * written, which the field's helper names whether the card sets it or not. Only a field
   * the card sets has a Reset.
   */
  private _resetTargets(shown: VariableDeclaration[], template: TemplateConfig | undefined): Map<string, FieldReset> {
    // The names as text: the shown list is filtered afresh each render.
    const names = shown.map((declaration) => declaration.name).join('\n');
    return this._builds.get('resets', this._readsKey(template, names), () => this._resetTargetsNow(shown, template));
  }

  private _resetTargetsNow(
    shown: VariableDeclaration[],
    template: TemplateConfig | undefined,
  ): Map<string, FieldReset> {
    const resets = new Map<string, FieldReset>();
    const variables = this._config?.variables;
    if (!template) return resets;
    const { places, extras, hass: scoped } = this._defaultReads(template);
    const own = variableValues(variables);
    for (const declaration of shown) {
      if (isCardDeclaration(declaration)) continue;
      const target = defaultTarget(declaration.name, variables, template, places);
      if (!target) continue;
      const json = JSON.stringify(target.value);
      const computed = typeof json === 'string' && PLACEHOLDER.test(json);
      const filled = computed
        ? filledDefault(target.value, withoutVariable(variables, declaration.name), template, scoped, extras)
        : target.value;
      const fallback = filled === undefined ? target.value : filled;
      resets.set(declaration.name, {
        text: defaultText(fallback) || '""',
        source: target.source,
        // Set to its own default is no different to look at than left alone (#487).
        set: declaration.name in own && !matchesDefault(own[declaration.name], fallback),
      });
    }
    return resets;
  }

  // Takes the card's own value out through the normal config-changed path, so undo and the preview follow (#255).
  private _resetVariable(name: string): void {
    if (!this._config) return;
    fireEvent(this, 'config-changed', { config: resetVariable(this._config, name) });
  }

  private _formData(declarations: VariableDeclaration[]): Record<string, unknown> {
    if (!declarations.length) return this._config as Record<string, unknown>;

    const values = variableValues(this._config?.variables);
    const described = new Set(declarations.map((declaration) => declaration.name));
    const data: Record<string, unknown> = { template: this._config?.template };
    this._shownAs = new Map();
    // What each unset field will be built with (#373), shown in the field but never written.
    const unset = declarations
      .filter((declaration) => !(declaration.name in values) && !isCardDeclaration(declaration))
      .map((declaration) => declaration.name);
    // With the dashboard's item templates, as the card builds with them (#404).
    const shownLl = this._lovelace ?? getLovelaceConfig();
    const shownTemplate = this._templates?.[this._config?.template as string];
    // #411: read with the states the card rebuilds on, as the card builds, or a default made
    // with `|state` or `|attr:` is blank here while the card itself fills it in.
    const defaults = this._builds.get('defaults', this._readsKey(shownTemplate, unset.join('\n')), () =>
      shownDefaults(
        unset,
        this._config?.variables,
        shownTemplate,
        withStateScope(this.hass, this._rebuildOnFor(shownTemplate)),
        { itemTemplates: itemTemplatesOf(shownLl), context: sourceContext(shownLl) },
      ),
    );
    for (const declaration of declarations) {
      if (!(declaration.name in values)) {
        if (!defaults.has(declaration.name)) continue;
        let shown = defaults.get(declaration.name);
        /*
         * A switch shows a word default (`on`, `yes`) the way the card reads it, so a
         * `default: true` no longer looks off while the card - and any show_if reading it
         * (#347) - takes it as on.
         */
        if ('boolean' in (declarationSelector(declaration) as object) && typeof shown !== 'boolean') {
          shown = TRUE_WORDS.has(String(shown).trim().toLowerCase());
        }
        this._shownAs.set(declaration.name, { shown, written: undefined });
        data[VARIABLE_FIELD_PREFIX + declaration.name] = shown;
        continue;
      }
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
    if (this._config?.columns !== undefined) data.columns = this._config.columns;
    if (this._config?.min_column_width !== undefined) data.min_column_width = this._config.min_column_width;
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
  /*
   * What the diagnostics have to say about the card as it stands, as alerts to show and the
   * required variables left unset - which the counter over the variables and the status line
   * under the preview both read, so they are worked out once per render.
   */
  private _diagnose(template: TemplateConfig | undefined, readable: boolean): Diagnosis {
    // Choosing by domain, the variables are shared by copies of different templates, so
    // what one of them leaves unset or unused says nothing about the others.
    if (!template || this._loadingTemplates || !readable || byDomainOf(this._config)) return { alerts: [], needed: [] };

    // The items' names count as supplied, so a variable only the items set is not
    // missing - but they are not the card's own, so they are never called unused.
    // Both kinds of repeat supply names to every copy, and neither is the card's own to
    // be called missing. A registry source supplies its set whether or not anything is
    // registered yet, so it is read from the source rather than from what it resolved to.
    const supplied = [
      ...this._suppliedNames(template),
      // An entity the card rebuilds on stands for itself in a placeholder.
      ...this._rebuildOnFor(template),
      // What the template's own `with:` and `repeat:` give the bodies they fill in, and the
      // item templates those name, which are the dashboard's rather than the card's.
      ...structureNames(template, normaliseVariables(this._config?.variables)),
      ...Object.keys(itemTemplatesOf(this._lovelace ?? getLovelaceConfig())),
    ];
    const repeated = supplied.map((name) => ({ [name]: null }));
    // The card's own for_each_from and on_error are filled in from its variables as well.
    const { missing, unused, required } = diagnoseInstance(
      this._config ? withSlotVariables(this._config).variables : undefined,
      template,
      repeated,
      [this._config?.for_each_from, this._config?.on_error],
      itemTemplatesReached(template, itemTemplatesOf(this._lovelace ?? getLovelaceConfig())),
    );
    const reads = this._defaultReads(template);
    // A value holding a placeholder is judged by what it becomes, as the field shows it (#490).
    const invalid = validateDeclared(
      this._config?.variables,
      template,
      this.hass,
      (value, name) =>
        template
          ? filledDefault(value, withoutVariable(this._config?.variables, name), template, reads.hass, reads.extras)
          : undefined,
      (declaration) => this._filledAllowed(declaration, template),
    );
    // A template can say which of its variables it cannot do without. Those are still not
    // errors that block a save - the template may be edited next - but they are the ones
    // worth reading first, so they are separated out and coloured accordingly.
    // A field the template hides is one it says it has no use for just now, so its being
    // unset is not worth a word - but a value it still holds is, since it still goes in.
    const hidden = this._hiddenNames(template, getDeclarations(template));
    const needed = required.filter((name) => !hidden.has(name));
    // An entity id in a placeholder reads Home Assistant, not a variable: unset, it means
    // the card does not rebuild on that entity, which is what the hint has to say (round 1, A2).
    const unlisted = missing.filter((name) => !required.includes(name) && ENTITY_ID_LIKE.test(name));
    const optional = missing.filter(
      (name) => !required.includes(name) && !hidden.has(name) && !unlisted.includes(name),
    );
    const own = new Set(ownVariables(this._config?.variables).map(variableName));
    const hiddenButSet = [...hidden].filter((name) => own.has(name));
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
    const failed = this._failedChecks(template);
    // A key the chosen template has that no template reads, such as variblees: (#494).
    const unknownKeys = unknownTemplateKeys(this._lovelace).filter((each) => each.template === this._config?.template);
    const alerts: DiagnosisAlert[] = [];
    const say = (level: DiagnosisAlert['level'], body: TemplateResult, fill = false): void => {
      alerts.push({ level, body, fill });
    };
    for (const alert of failed) {
      say(
        alert.level === 'error' ? 'error' : 'warning',
        html`${localize(
          alert.name ? 'editor.check_failed_named' : 'editor.check_failed',
          { name: alert.name ?? '', message: alert.message },
          this.hass,
        )}`,
      );
    }
    for (const key of misplaced) {
      say(
        'warning',
        html`${localize(
          'editor.override_misplaced',
          { key, kind: kind as string, template: this._config?.template ?? '' },
          this.hass,
        )}`,
      );
    }
    if (fixedColumns) say('info', html`${localize('editor.columns_without_min_width', { columns }, this.hass)}`);
    if (fitHidesStyle) say('warning', html`${localize('editor.fit_hides_style', undefined, this.hass)}`);
    if (hiddenButSet.length) {
      say(
        'warning',
        html`${localize(
          hiddenButSet.length === 1 ? 'editor.hidden_but_set_one' : 'editor.hidden_but_set_many',
          { names: hiddenButSet.join(', ') },
          this.hass,
        )}`,
      );
    }
    if (needed.length) {
      say(
        'error',
        html`${localize(
          needed.length === 1 ? 'editor.required_one' : 'editor.required_many',
          { names: needed.join(', ') },
          this.hass,
        )}`,
        true,
      );
    }
    if (unlisted.length) {
      say('warning', html`${localize('editor.rebuild_on_hint', { names: unlisted.join(', ') }, this.hass)}`);
    }
    if (optional.length) {
      say(
        'warning',
        html`${localize(
          optional.length === 1 ? 'editor.optional_one' : 'editor.optional_many',
          { names: optional.join(', ') },
          this.hass,
        )}`,
      );
    }
    for (const each of unknownKeys) {
      say(
        'warning',
        html`${localize('tools.health_unknown_key', { template: each.template, key: each.key }, this.hass)}${
          each.closest ? localize('error.did_you_mean', { closest: each.closest }, this.hass) : ''
        }`,
      );
    }
    for (const each of invalid) {
      say(
        'warning',
        html`${localize('editor.invalid_value', { name: each.name, expected: each.expected }, this.hass)}
        ${localize('editor.invalid_value_now', { value: each.value }, this.hass)}`,
      );
    }
    if (unused.length) {
      say(
        'info',
        html`${localize(
          unused.length === 1 ? 'editor.unused_one' : 'editor.unused_many',
          { names: unused.join(', ') },
          this.hass,
        )}`,
      );
    }
    return { alerts, needed };
  }

  /*
   * The template's checks that fail with the card's values as they stand (#389) - the
   * warnings and errors; an info is for the console. Read the way the card reads them, with
   * the states it rebuilds on and the dashboard's item templates.
   */
  private _failedChecks(template: TemplateConfig): Alert[] {
    if (!checksOf(template).length || !this._config) return [];
    return this._builds.get('checks', this._readsKey(template), () => this._failedChecksNow(template));
  }

  private _failedChecksNow(template: TemplateConfig): Alert[] {
    if (!this._config) return [];
    const ll = this._lovelace ?? getLovelaceConfig();
    const scoped = withStateScope(this.hass, this._rebuildOnFor(template));
    const name = this._config.template;
    const variables = withSlotVariables(this._config).variables;
    try {
      return runChecks(
        template,
        name,
        (content) =>
          deepReplace(variables, template, content, name, scoped, true, undefined, 0, undefined, undefined, false, {
            itemTemplates: itemTemplatesOf(ll),
            context: sourceContext(ll),
          }),
        this.hass,
      ).filter((alert) => alert.level !== 'info');
    } catch {
      return [];
    }
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
      // A switch shown for a written word it was not moved from keeps the word, and a default
      // only shown in its field (#373) stays unwritten until the field is changed.
      const shownAs = this._shownAs.get(declaration.name);
      if (shownAs && isShownValue(value, shownAs.shown)) value = shownAs.written;
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
    setOrDelete(config, 'columns', data.columns);
    setOrDelete(config, 'min_column_width', data.min_column_width);
    setOrDelete(config, 'gap', data.gap);
    // Off is the default, so switching it off takes the key out rather than writing false.
    setOrDelete(config, 'lazy', data.lazy === true ? true : undefined);
    setOrDelete(config, 'lazy_eager', data.lazy_eager);

    // #510: a field that waits to be left keeps its value here and tells the preview later.
    if (onlyLeaveFieldsChanged(this._config, config, declarations)) {
      this.setConfig(config);
      this._unsent = config;
      return;
    }
    fireEvent(this, 'config-changed', { config });
  }

  // Tells the preview about a value held back while its field was typed in (#510).
  private _sendUnsent(): void {
    const config = this._unsent;
    if (!config) return;
    this._unsent = undefined;
    fireEvent(this, 'config-changed', { config });
  }

  // Enter in a one-line field counts as leaving it; in a box of lines it is a new line.
  private _enterSends(ev: KeyboardEvent): void {
    if (ev.key !== 'Enter' || (ev.composedPath()[0] as Element | undefined)?.tagName === 'TEXTAREA') return;
    this._sendUnsent();
  }

  // The dropdown starts with this dashboard's templates and gains the borrowed ones once
  // the other dashboards have been read.
  private _loadBorrowedTemplates(): void {
    if (!mayBorrowTemplates(this._lovelace)) return;
    this._loadingTemplates = true;
    const place = this._editingPlace();
    collectAllTemplates(this.hass, this._lovelace, place.view, undefined, place.section)
      .then((templates) => {
        this._templates = translatedTemplates(templates, this.hass);
        this._schema = undefined;
      })
      .finally(() => {
        this._loadingTemplates = false;
        this.requestUpdate();
      });
  }
}
