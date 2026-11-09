import { HomeAssistant } from 'custom-card-helpers';
import { HELPERS } from './shared';

/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * The N rows, or N picture elements, a repeated row or element template builds (idea 34).
 *
 * Home Assistant gives a row one slot in an entities card and an element one place in a
 * picture, so a repeat has nowhere of its own to put a second copy. This element takes the
 * slot and gets out of the way - `display: contents` - so the copies inside it paint as
 * though each had been written in the list: the entities card sees one child that draws
 * four rows, the picture sees one element that places four markers.
 *
 * Only ever written by the card itself, into the config it builds for a repeat.
 */
// The config and its type are in build.ts, which the docs site's Try a template page shares (#427).
export { MANY_TAG, MANY_TYPE, manyConfig } from './build';
export type { ManyKind, ManyConfig } from './build';
import { ManyConfig, ManyKind } from './build';

// The space an entities card leaves between its rows, kept between the copies here too.
const ROW_GAP = '8px';

export class DeclutteringMany extends HTMLElement {
  private _config?: ManyConfig;
  private _hassValue?: HomeAssistant;
  private _things: any[] = [];
  // Which setConfig the elements on the page belong to, so a late build of an older config
  // does not land on top of a newer one.
  private _building?: ManyConfig;

  public setConfig(config: ManyConfig): void {
    this._config = config;
    void this._build(config);
  }

  set hass(hass: HomeAssistant) {
    this._hassValue = hass;
    for (const thing of this._things) thing.hass = hass;
  }

  public connectedCallback(): void {
    this.style.display = 'contents';
  }

  private async _build(config: ManyConfig): Promise<void> {
    this._building = config;
    const helpers = HELPERS ? await HELPERS : undefined;
    if (this._building !== config) return;
    for (const thing of this._things) thing.remove();
    this._things = [];
    const items = Array.isArray(config?.items) ? config.items : [];
    items.forEach((item, index) => {
      const thing = this._create(helpers, config.kind, item);
      if (!thing) return;
      if (config.kind === 'element') {
        // Placed the way the picture places its own elements, since this element has no box.
        thing.classList.add('element');
        thing.style.position = 'absolute';
        thing.style.transform = 'translate(-50%, -50%)';
        const style = item?.style;
        if (style && typeof style === 'object') {
          for (const [prop, value] of Object.entries(style)) thing.style.setProperty(prop, String(value));
        }
      } else if (index > 0) {
        thing.style.marginTop = ROW_GAP;
      }
      if (this._hassValue) thing.hass = this._hassValue;
      this._things.push(thing);
      this.appendChild(thing);
    });
  }

  private _create(helpers: any, kind: ManyKind, item: Record<string, any>): any {
    if (!helpers) return undefined;
    try {
      return kind === 'row' ? helpers.createRowElement(item) : helpers.createHuiElement(item);
    } catch {
      return undefined;
    }
  }

  // An entities card asks nothing of a row's size; this keeps the card API happy anyway.
  public getCardSize(): number {
    return this._things.length || 1;
  }
}
