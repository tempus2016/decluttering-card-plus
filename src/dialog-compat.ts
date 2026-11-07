import { html, TemplateResult } from 'lit';

/*
 * Home Assistant's `ha-dialog` changed under us. Up to 2026.6 it was the mwc dialog: a
 * `heading` property, buttons in the `primaryAction` / `secondaryAction` slots, and a
 * `dialogAction` attribute on a button to close it. From 2026.7 it is a new element: the
 * title is `headerTitle`, everything at the bottom goes in one `footer` slot - Home Assistant
 * puts an `ha-dialog-footer` there, whose own slots are again `primaryAction` and
 * `secondaryAction` - and `dialogAction` does nothing. A dialog written for the old one opens
 * on the new one with no title and no buttons at all, so nothing in it can be saved.
 *
 * These helpers write for whichever is on the page. Buttons keep their `slot="primaryAction"`
 * / `slot="secondaryAction"` attributes in both, and close by click handler rather than by
 * `dialogAction`, which only the old one understood.
 */

/** Whether the page's `ha-dialog` is the 2026.7 one, with `headerTitle` and a footer slot. */
export function modernDialog(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dialog = customElements.get('ha-dialog') as any;
  const props = dialog?.elementProperties;
  return !!props && typeof props.has === 'function' && props.has('headerTitle');
}

/**
 * The dialog's buttons, placed where the page's `ha-dialog` looks for them. Pass the buttons
 * with their `slot="primaryAction"` / `slot="secondaryAction"` attributes already on them.
 */
export function dialogButtons(buttons: TemplateResult): TemplateResult {
  if (!modernDialog()) return buttons;
  if (customElements.get('ha-dialog-footer'))
    return html`<ha-dialog-footer slot="footer">${buttons}</ha-dialog-footer>`;
  return html`<div slot="footer" style="display:flex;justify-content:flex-end;gap:8px;padding:0 24px 16px">
    ${buttons}
  </div>`;
}
