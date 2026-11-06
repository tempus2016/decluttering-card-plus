/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * What is installed on this Home Assistant and in this browser (#397): an integration, a
 * custom card, a set of icons. A template shared with somebody else can ask, and fall back
 * on what everybody has - `[[popup|card_exists]]` switches a more-info replacement on only
 * where the card is there, `[[dog_icon|if_icon_exists|or:stock_icon]]` swaps a custom icon
 * for a stock one where its set is missing.
 *
 * Every answer here is "yes", "no", or undefined for "there is nothing to ask yet", which
 * leaves the placeholder for a later build the way `exists` does before hass arrives.
 */

/** Whether one of Home Assistant's loaded components is this integration. */
export function integrationLoaded(components: readonly string[], domain: string): boolean {
  const wanted = domain.trim();
  if (!wanted) return false;
  // A platform loads as `sensor.frigate`; the integration is the part after the dot.
  return components.some((each) => each === wanted || each.split('.').pop() === wanted);
}

/** Whether Home Assistant has this integration loaded, or undefined with no Home Assistant to ask. */
export function integrationExists(domain: string, hass: any): boolean | undefined {
  const components = hass?.config?.components;
  if (!Array.isArray(components)) return undefined;
  return integrationLoaded(components, domain);
}

/** The element a card type names: `custom:mushroom-entity-card` and `mushroom-entity-card` alike. */
export function cardTag(type: string): string {
  return type.trim().replace(/^custom:/, '');
}

// Tags somebody asked about that were not defined yet, so each is waited for once.
const waiting = new Set<string>();
const listeners = new Set<() => void>();
// Moves whenever something waited for turns up, so a card can tell it has to build again.
let tick = 0;

function changed(): void {
  tick += 1;
  for (const listener of [...listeners]) listener();
}

/*
 * Whether a custom element is registered in this browser - or undefined where there is no
 * registry at all. A custom card's script can load after the card asking about it has
 * built, so a tag that is not there yet is waited for, once, and its arrival tells every
 * card listening to build again.
 */
export function cardExists(type: string): boolean | undefined {
  const registry = (globalThis as any).customElements;
  if (!registry || typeof registry.get !== 'function') return undefined;
  const tag = cardTag(type);
  // Only a valid custom element name can ever be defined; anything else is a plain no.
  if (!/^[a-z][a-z0-9._-]*-[a-z0-9._-]*$/.test(tag)) return false;
  if (registry.get(tag)) return true;
  if (!waiting.has(tag) && typeof registry.whenDefined === 'function') {
    waiting.add(tag);
    Promise.resolve(registry.whenDefined(tag))
      .then(changed)
      .catch(() => undefined);
  }
  return false;
}

/*
 * The icon sets this browser knows. Home Assistant's own `mdi` is always there; custom ones
 * register on `window.customIcons` (the current way) or `window.customIconsets` (the old
 * one), which custom-icons, hass-fontawesome and the like fill in when they load.
 */
function iconSets(): string[] {
  const scope = globalThis as any;
  return ['mdi', ...Object.keys(scope.customIcons ?? {}), ...Object.keys(scope.customIconsets ?? {})];
}

/*
 * Whether the set an icon comes from is installed - `gamer-icons:dog` asks about
 * `gamer-icons`. Only the set: whether that one icon is in it takes a lookup that answers
 * later, and a build cannot wait for it. Undefined where there is no browser to ask.
 */
export function iconExists(icon: string): boolean | undefined {
  if (typeof (globalThis as any).window === 'undefined') return undefined;
  const text = icon.trim();
  const colon = text.indexOf(':');
  if (colon <= 0 || colon === text.length - 1) return false;
  return iconSets().includes(text.slice(0, colon));
}

/*
 * What a build that asked about any of this read, for telling when it has to build again:
 * the components Home Assistant has loaded, the icon sets, and the custom elements that
 * turned up since. Icon sets announce nothing when they register, so they are only noticed
 * at the next hass update - a state change anywhere in the house, which is seldom long.
 */
export function installedKey(hass: any): unknown[] {
  return [hass?.config?.components, iconSets().join(','), tick];
}

/** Calls back whenever a custom element somebody asked about is defined. Returns the way to stop. */
export function whenInstalledChanges(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
