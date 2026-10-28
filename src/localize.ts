import en from './locales/en.json';

/*
 * Every sentence the card shows is looked up here by key, so a dashboard set to another
 * language reads in that language. English is compiled into the bundle; the other
 * languages are chunks of their own (idea 4), fetched once when the page's language first
 * asks for one - requested as this module loads, so the chunk is normally there before the
 * first card builds. Until it is, a sentence falls back to English rather than to a raw
 * key, and every element re-renders when the language lands.
 *
 * A language is tried most specific first - "pt-BR" reads pt-BR.json if it exists, then
 * pt.json - and anything a locale does not translate falls back to English, so a partial
 * translation is better than none rather than broken.
 */

const LANGUAGES: Record<string, Record<string, string>> = { en };

// One loader per bundled language; a dynamic import each, so rollup makes each a chunk.
const LOADERS: Record<string, () => Promise<{ default: Record<string, string> }>> = {
  de: () => import('./locales/de.json'),
  es: () => import('./locales/es.json'),
  fr: () => import('./locales/fr.json'),
  nl: () => import('./locales/nl.json'),
  pt: () => import('./locales/pt.json'),
};

const loading = new Map<string, Promise<void>>();

/** Fired on window once a language's strings have arrived, so what is on screen can be drawn again. */
export const LANGUAGE_LOADED_EVENT = 'decluttering-card-plus-language-loaded';

/** The languages that can be loaded, English included. */
export const AVAILABLE_LANGUAGES = ['en', ...Object.keys(LOADERS)];

/**
 * Makes a language's strings available, fetching its chunk the first time. Resolves at once
 * for English, for a language already here, and for one this card does not have.
 */
export function ensureLanguage(language: string): Promise<void> {
  const wanted = candidatesFor(language).find((candidate) => LOADERS[candidate] !== undefined);
  if (!wanted || LANGUAGES[wanted]) return Promise.resolve();
  let pending = loading.get(wanted);
  if (!pending) {
    pending = LOADERS[wanted]()
      .then((module) => {
        registerLanguage(wanted, module.default);
      })
      .catch(() => {
        // Left English; asked again next time something needs the language.
        loading.delete(wanted);
      });
    loading.set(wanted, pending);
  }
  return pending;
}

/** Puts a language's strings in place without fetching anything: the loader's last step, and the tests' way in. */
export function registerLanguage(code: string, strings: Record<string, string>): void {
  LANGUAGES[code] = strings;
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(LANGUAGE_LOADED_EVENT));
}

/** Calls back whenever a language lands; returns what to call to stop listening. */
export function onLanguageLoaded(listener: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  window.addEventListener(LANGUAGE_LOADED_EVENT, listener);
  return () => window.removeEventListener(LANGUAGE_LOADED_EVENT, listener);
}

const FALLBACK = 'en';

/** "pt-BR" is worth trying as "pt" too, most specific first. */
function candidatesFor(language: string): string[] {
  const candidates = [language];
  if (language.includes('-')) candidates.push(language.split('-')[0]);
  return candidates;
}

/** The shape of hass this module reads - the card must not depend on the full type. */
interface HassLanguage {
  language?: string;
  locale?: { language?: string };
}

/*
 * Most of what this card says comes from modules that never see hass - a cycle is
 * described where it is found, an import is validated where it is parsed. For those the
 * language is read off the page: the hass object Home Assistant keeps on its root
 * element, or the language it stores for the user, or the browser's own. Outside a
 * browser - the unit tests - everything falls back to English, which is also what the
 * tests assert against.
 */
function pageLanguage(): string | undefined {
  if (typeof document !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hass = (document.querySelector('home-assistant') as any)?.hass as HassLanguage | undefined;
    const live = hass?.locale?.language ?? hass?.language;
    if (live) return live;
  }
  if (typeof localStorage !== 'undefined') {
    try {
      // Home Assistant stores the user's chosen language here, JSON-encoded.
      const stored = JSON.parse(localStorage.getItem('selectedLanguage') ?? 'null');
      if (typeof stored === 'string' && stored) return stored;
    } catch {
      // Anything unreadable is the same as nothing stored.
    }
  }
  if (typeof navigator !== 'undefined' && navigator.language) return navigator.language;
  return undefined;
}

/**
 * The sentence for `key` in the user's language, with every `{name}` in it replaced by
 * `params[name]`. Pass `hass` where there is one - it answers for the user rather than
 * the browser - and a key no locale knows comes back as itself, which at least says
 * what is missing.
 */
export function localize(key: string, params?: Record<string, unknown>, hass?: HassLanguage): string {
  const language = hass?.locale?.language ?? hass?.language ?? pageLanguage() ?? FALLBACK;

  let text: string | undefined;
  for (const candidate of candidatesFor(language)) {
    text = LANGUAGES[candidate]?.[key];
    if (text !== undefined) break;
  }
  // A language not here yet is asked for now and answered in English this once.
  if (text === undefined && language !== FALLBACK) void ensureLanguage(language);
  text ??= LANGUAGES[FALLBACK][key] ?? key;

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
}

// Asked for as the resource loads, so the chunk is normally here before the first card builds.
{
  const language = pageLanguage();
  if (language) void ensureLanguage(language);
}
