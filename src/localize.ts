import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';

/*
 * Every sentence the card shows is looked up here by key, so a dashboard set to another
 * language reads in that language. The locale files are compiled into the bundle rather
 * than fetched: this card is one file with no backend to serve them from, and a bundled
 * lookup is synchronous - no render ever shows a raw key while a file loads.
 *
 * A language is tried most specific first - "pt-BR" reads pt-BR.json if it exists, then
 * pt.json - and anything a locale does not translate falls back to English, so a partial
 * translation is better than none rather than broken.
 */

const LANGUAGES: Record<string, Record<string, string>> = { de, en, es, fr, pt };

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
  text ??= LANGUAGES[FALLBACK][key] ?? key;

  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
}
