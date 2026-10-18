import { html, TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { DiffLine, DiffSkip, hasChanges, lineDiff, withContext } from './diff';
import { localize } from './localize';
import { toYaml } from './yaml';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * How a before-and-after is drawn: a unified diff of the two as YAML, removed lines on a
 * red ground and added ones on green, with long unchanged stretches folded. Exported for
 * anything else that shows a change before making it - the impact preview, renaming a
 * variable, turning similar cards into a template, an update to a shared template.
 *
 * The styles travel inside the result rather than in a stylesheet the caller has to
 * remember to include: every editor here renders into its own shadow root, and a diff
 * that came out unstyled in one of them would be easy to miss and hard to read.
 */
const DIFF_STYLE = html`<style>
  .dcp-diff {
    margin: 0;
    padding: 4px 0;
    overflow: auto;
    font-family: var(--ha-font-family-code, monospace);
    font-size: 0.85em;
    line-height: 1.45;
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    -webkit-user-select: text;
    user-select: text;
  }
  .dcp-diff div {
    white-space: pre;
    padding: 0 8px;
  }
  .dcp-diff .add {
    background: color-mix(in srgb, var(--success-color, #43a047) 18%, transparent);
  }
  .dcp-diff .remove {
    background: color-mix(in srgb, var(--error-color, #db4437) 18%, transparent);
  }
  .dcp-diff .skip {
    color: var(--secondary-text-color);
    font-style: italic;
  }
  .dcp-diff-none {
    margin: 0;
    color: var(--secondary-text-color);
    font-size: 0.9em;
  }
</style>`;

/** A value as the text the diff compares: YAML for anything structured, as written for text. */
function asText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === undefined) return '';
  return toYaml(value);
}

const MARK: Record<string, string> = { same: ' ', add: '+', remove: '-' };

function renderLine(line: DiffLine | DiffSkip, hass?: any): TemplateResult {
  if (line.kind === 'skip') {
    return html`<div class="skip">${localize('diff.skipped', { count: line.count }, hass)}</div>`;
  }
  // The sign is part of the line, so a copy out of the diff still says which way each went.
  return html`<div class=${line.kind}>${MARK[line.kind]} ${line.text}</div>`;
}

/**
 * The difference between two configs, or two texts. Objects are written out as YAML
 * first. When nothing differs it says so, rather than drawing an empty box.
 */
export function renderDiff(before: unknown, after: unknown, hass?: any, context = 3): TemplateResult {
  const lines = lineDiff(asText(before), asText(after));
  if (!hasChanges(lines)) {
    return html`${DIFF_STYLE}
      <p class="dcp-diff-none">${localize('diff.no_change', undefined, hass)}</p>`;
  }
  return html`${DIFF_STYLE}
    <div class="dcp-diff" role="figure" aria-label=${localize('diff.label', undefined, hass)}>
      ${withContext(lines, context).map((line) => renderLine(line, hass))}
    </div>`;
}

/**
 * The diff, with the whole of both sides available underneath for whoever wants to read
 * them in full. ha-yaml-editor reads its value once, so each box is keyed by what it shows
 * and is replaced when that changes.
 */
export function renderDiffWithFull(before: unknown, after: unknown, hass?: any): TemplateResult {
  const beforeKey = JSON.stringify(before) ?? '';
  const afterKey = JSON.stringify(after) ?? '';
  return html`
    ${renderDiff(before, after, hass)}
    <ha-expansion-panel outlined>
      <span slot="header">${localize('diff.full', undefined, hass)}</span>
      <p class="dcp-diff-none">${localize('diff.before', undefined, hass)}</p>
      ${keyed(beforeKey, html`<ha-yaml-editor .hass=${hass} .defaultValue=${before} read-only></ha-yaml-editor>`)}
      <p class="dcp-diff-none">${localize('diff.after', undefined, hass)}</p>
      ${keyed(afterKey, html`<ha-yaml-editor .hass=${hass} .defaultValue=${after} read-only></ha-yaml-editor>`)}
    </ha-expansion-panel>
  `;
}
