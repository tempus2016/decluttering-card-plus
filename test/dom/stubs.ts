/*
 * Stand-ins for the parts of Home Assistant the card leans on in a page: the hass object,
 * the chain of elements the dashboard config is read through, and hui-card, hui-badge and
 * hui-section. Each is a few lines and lives here with the tests, so an upstream rename
 * shows as one failing stub rather than a silent pass.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export function stubHass(states: Record<string, string> = {}): any {
  const built: Record<string, any> = {};
  for (const [id, state] of Object.entries(states)) {
    built[id] = {
      entity_id: id,
      state,
      attributes: { friendly_name: id.split('.')[1] },
      last_changed: new Date().toISOString(),
    };
  }
  return {
    states: built,
    entities: {},
    devices: {},
    areas: {},
    floors: {},
    language: 'en',
    locale: { language: 'en' },
    localize: (key: string) => key,
    config: { version: 'test' },
    themes: { darkMode: false },
    user: { is_admin: true },
    callWS: async () => [],
    callApi: async () => undefined,
    connection: { subscribeEvents: async () => () => undefined, subscribeMessage: async () => () => undefined },
  };
}

// A hui-card condition the stubs understand: `{ condition: 'state', entity, state }` or `state_not`.
function conditionHolds(condition: any, hass: any): boolean {
  if (!condition || condition.condition !== 'state') return true;
  const current = hass?.states?.[condition.entity]?.state;
  if (condition.state !== undefined) return current === condition.state;
  if (condition.state_not !== undefined) return current !== condition.state_not;
  return true;
}

/*
 * hui-card as the card relies on it: takes `config`, `hass` and `preview`, makes the element
 * for a custom type, hides itself with the `hidden` attribute when a visibility condition
 * fails (unless previewing), says so with card-visibility-changed, and follows a child that
 * hides itself - a group - the way Home Assistant's does.
 */
class StubHuiCard extends HTMLElement {
  private _config: any;
  private _hass: any;
  private _preview = false;
  private _element?: any;
  public layout?: string;

  constructor() {
    super();
    this.addEventListener('card-visibility-changed', (ev) => {
      if (ev.composedPath()[0] !== this) this._apply();
    });
  }

  set config(config: any) {
    this._config = config;
    this._element = undefined;
    this.replaceChildren();
    if (typeof config?.type === 'string' && config.type.startsWith('custom:')) {
      const tag = config.type.slice('custom:'.length);
      const make = (): void => {
        const element = document.createElement(tag) as any;
        element.setConfig?.(config);
        if (this._hass) element.hass = this._hass;
        if ('preview' in element) element.preview = this._preview;
        this._element = element;
        this.appendChild(element);
        this._apply();
      };
      if (customElements.get(tag)) make();
      else void customElements.whenDefined(tag).then(make);
    } else {
      const text = document.createElement('div');
      text.className = 'stub-card';
      text.textContent = typeof config?.content === 'string' ? config.content : (config?.type ?? '');
      this.appendChild(text);
    }
    this._apply();
  }

  get config(): any {
    return this._config;
  }

  set hass(hass: any) {
    this._hass = hass;
    if (this._element) this._element.hass = hass;
    this._apply();
  }

  get hass(): any {
    return this._hass;
  }

  set preview(preview: boolean) {
    this._preview = preview;
    if (this._element && 'preview' in this._element) this._element.preview = preview;
    this._apply();
  }

  get preview(): boolean {
    return this._preview;
  }

  public getCardSize(): number {
    return 1;
  }

  private _apply(): void {
    const visibility = Array.isArray(this._config?.visibility) ? this._config.visibility : [];
    const failed = !this._preview && visibility.some((condition: any) => !conditionHolds(condition, this._hass));
    const childHidden = !!this._element?.hasAttribute?.('hidden');
    const hidden = failed || childHidden;
    if (this.hasAttribute('hidden') === hidden) return;
    this.toggleAttribute('hidden', hidden);
    this.dispatchEvent(new Event('card-visibility-changed', { bubbles: true, composed: true }));
  }
}

/* hui-badge: the same, for the row of badges; it records `preview`, which is the whole point of one test. */
class StubHuiBadge extends HTMLElement {
  private _config: any;
  private _hass: any;
  private _preview = false;
  public previewSets: boolean[] = [];

  set config(config: any) {
    this._config = config;
    this.textContent = config?.entity ?? config?.type ?? '';
    this._apply();
  }

  get config(): any {
    return this._config;
  }

  set hass(hass: any) {
    this._hass = hass;
    this._apply();
  }

  get hass(): any {
    return this._hass;
  }

  set preview(preview: boolean) {
    this._preview = preview;
    this.previewSets.push(preview);
    this._apply();
  }

  get preview(): boolean {
    return this._preview;
  }

  private _apply(): void {
    const visibility = Array.isArray(this._config?.visibility) ? this._config.visibility : [];
    const hidden = !this._preview && visibility.some((condition: any) => !conditionHolds(condition, this._hass));
    if (this.hasAttribute('hidden') === hidden) return;
    this.toggleAttribute('hidden', hidden);
    this.dispatchEvent(new Event('badge-visibility-changed', { bubbles: true, composed: true }));
  }
}

/* hui-section: only its place matters to the card - which view, which section. */
class StubHuiSection extends HTMLElement {
  public index?: number;
  public viewIndex?: number;
}

export function stubElements(): void {
  if (!customElements.get('hui-card')) customElements.define('hui-card', StubHuiCard);
  if (!customElements.get('hui-badge')) customElements.define('hui-badge', StubHuiBadge);
  if (!customElements.get('hui-section')) customElements.define('hui-section', StubHuiSection);
}

/*
 * The chain of elements getLovelace() in src/utils.ts walks, with the dashboard at the end
 * of it. Built fresh per test and removed with the body.
 */
export function stubLovelace(config: Record<string, any>, extra: Record<string, any> = {}): any {
  const lovelace = { config, mode: 'storage', editMode: false, urlPath: 'lovelace', ...extra };
  const root = document.createElement('home-assistant');
  const rootShadow = root.attachShadow({ mode: 'open' });
  const main = document.createElement('home-assistant-main');
  rootShadow.appendChild(main);
  const mainShadow = main.attachShadow({ mode: 'open' });
  const drawer = document.createElement('ha-drawer');
  mainShadow.appendChild(drawer);
  const resolver = document.createElement('partial-panel-resolver');
  drawer.appendChild(resolver);
  const panel = document.createElement('ha-panel-lovelace');
  resolver.appendChild(panel);
  const panelShadow = panel.attachShadow({ mode: 'open' });
  const huiRoot = document.createElement('hui-root') as any;
  huiRoot.lovelace = lovelace;
  panelShadow.appendChild(huiRoot);
  document.body.appendChild(root);
  return lovelace;
}

/** A hui-section at a place, on the page, for cards to go in. */
export function stubSection(viewIndex: number, index: number): HTMLElement {
  const section = document.createElement('hui-section') as any;
  section.viewIndex = viewIndex;
  section.index = index;
  document.body.appendChild(section);
  return section;
}

/** The element the wrapper built, when it has. */
export function wrapped(card: any): any {
  return card?.shadowRoot?.querySelector('hui-card, hui-badge, hui-section, [class*="stub"], *:not(style)') ?? null;
}
