/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * Categories - the folders Home Assistant's automation, script, scene and helper lists
 * are sorted into. `hass.entities` is the display version of the entity registry and
 * leaves them out, and the names live in a registry of their own that is kept per list
 * ("scope"), so both are fetched here: the full entity registry for which entity sits in
 * which category, and the category registry of every scope that turns up in it.
 *
 * Fetched only by a card that narrows by `category:`, once per page. When either registry
 * changes it is fetched again straight away, and the old answer is kept until the new one
 * lands: dropping it would have the next build - which an entity registry change sets off
 * by itself, through hass.entities - match nothing and flash the `empty:` card. A change to
 * the category registry alone moves nothing on hass, so the cards that asked are told when
 * the new answer lands (whenCategoriesChange) and rebuild then. Until the first answer
 * lands, a category matches nothing.
 */

export interface CategoryRegistry {
  /** The category each entity is filed under, per scope: `{ automation: '01J...' }`. */
  entities: Record<string, Record<string, string>>;
  /** The name of each category, per scope. */
  names: Record<string, Record<string, string>>;
}

/** One category an entity is filed under. */
export interface EntityCategory {
  scope: string;
  id: string;
  name: string;
}

let cache: CategoryRegistry | undefined;
let loading: Promise<void> | undefined;
let watching = false;
// A change came in while a fetch was already under way, so that fetch may be out of date.
let again = false;
const listeners = new Set<() => void>();

/** What was fetched, or nothing yet. A new object after every fetch, which is what registry keys compare. */
export function categoryRegistry(): CategoryRegistry | undefined {
  return cache;
}

/** Every category an entity is filed under, with its name where the registry gave one. */
export function categoriesOf(entityId: string): EntityCategory[] {
  const filed = cache?.entities?.[entityId];
  if (!filed) return [];
  return Object.entries(filed)
    .filter(([, id]) => typeof id === 'string' && !!id)
    .map(([scope, id]) => ({ scope, id, name: cache?.names?.[scope]?.[id] ?? id }));
}

/** Builds the cache from what the two calls answered. Pure, so it can be tested on its own. */
export function buildCategoryRegistry(
  entries: any[] | undefined,
  namesByScope: Record<string, any[] | undefined>,
): CategoryRegistry {
  const entities: CategoryRegistry['entities'] = {};
  for (const entry of entries ?? []) {
    const categories = entry?.categories;
    if (!entry?.entity_id || !categories || typeof categories !== 'object') continue;
    if (Object.keys(categories).length) entities[entry.entity_id] = { ...categories };
  }
  const names: CategoryRegistry['names'] = {};
  for (const [scope, list] of Object.entries(namesByScope)) {
    names[scope] = {};
    for (const category of list ?? []) {
      if (category?.category_id) names[scope][category.category_id] = category.name ?? category.category_id;
    }
  }
  return { entities, names };
}

/** The scopes anything is filed under, so only those category lists are fetched. */
function scopesIn(entries: any[] | undefined): string[] {
  const scopes = new Set<string>();
  for (const entry of entries ?? []) {
    const categories = entry?.categories;
    if (categories && typeof categories === 'object') for (const scope of Object.keys(categories)) scopes.add(scope);
  }
  return [...scopes];
}

/**
 * Fetch both registries once. Resolves when they have landed (or failed - then nothing
 * matches a category, and the next call tries again).
 */
export function loadCategories(hass: any): Promise<void> {
  if (cache) return Promise.resolve();
  if (loading) return loading;
  if (typeof hass?.callWS !== 'function') return Promise.resolve();

  if (!watching && typeof hass?.connection?.subscribeEvents === 'function') {
    watching = true;
    // Filing an automation under a category is an entity registry change; renaming the
    // category is a category registry one. Either makes what was fetched wrong.
    const refetch = (): void => {
      if (loading) {
        again = true;
        return;
      }
      void fetchCategories(hass);
    };
    hass.connection.subscribeEvents(refetch, 'entity_registry_updated');
    hass.connection.subscribeEvents(refetch, 'category_registry_updated');
  }
  return fetchCategories(hass);
}

/**
 * Asks for a call when a fetch after a registry change lands, so a card can rebuild with
 * it. Gives back the function that stops asking.
 */
export function whenCategoriesChange(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/*
 * One fetch of both registries. What was there before stays until the new answer is in,
 * and a fetch that fails leaves it as it was. A change that came in mid-fetch fetches
 * once more afterwards, however many there were.
 */
function fetchCategories(hass: any): Promise<void> {
  const refresh = !!cache;
  loading = hass
    .callWS({ type: 'config/entity_registry/list' })
    .then(async (entries: any[]) => {
      const namesByScope: Record<string, any[] | undefined> = {};
      for (const scope of scopesIn(entries)) {
        // A scope whose names cannot be read still matches by id, which is better than nothing.
        namesByScope[scope] = await hass
          .callWS({ type: 'config/category_registry/list', scope })
          .catch(() => undefined);
      }
      cache = buildCategoryRegistry(entries, namesByScope);
    })
    .catch(() => undefined)
    .then(() => {
      loading = undefined;
      if (again) {
        again = false;
        void fetchCategories(hass);
        return;
      }
      if (refresh) for (const listener of [...listeners]) listener();
    });
  return loading as Promise<void>;
}

/**
 * Whether anything in a source (or a list of them, `with:` and `exclude:` included)
 * narrows by category, so only those cards pay for fetching the whole entity registry.
 * `entity_category:` is a different thing and does not count.
 */
export function wantsCategories(source: unknown): boolean {
  return /"category":/.test(JSON.stringify(source ?? null));
}

/** For tests: forget everything fetched. */
export function resetCategories(): void {
  cache = undefined;
  loading = undefined;
  watching = false;
  again = false;
  listeners.clear();
}
