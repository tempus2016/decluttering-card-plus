/* eslint-disable @typescript-eslint/no-explicit-any */

/*
 * `for_each_from: { template: "{{ ... }}" }` - a list worked out by a Jinja template on the
 * Home Assistant side, for the lists no filter here can describe: the lights that are on,
 * the sensors below 20%, whatever a template can select.
 *
 * Rendered ONCE. Home Assistant's render_template is a subscription that re-sends the
 * result every time anything the template reads changes, and keeping it would rebuild
 * the card on state changes - exactly what substitution building a card's config once is
 * there to avoid (see CONTRIBUTING). So the first result is taken and the subscription is
 * dropped straight away. "The lights that are on" is the lights that were on when the
 * card was built; that is the deliberate limit, and the docs say so.
 */

/** What one template rendered to: the value Home Assistant sent, or what went wrong. */
export type TemplateRender = { result: unknown } | { error: string };

// Long enough for a slow template on a busy instance, short enough that a card does not
// wait for good on a connection that dropped mid-render.
const TIMEOUT = 10000;

/**
 * Renders a template once over the websocket and unsubscribes. Never rejects: a failure
 * comes back as `{ error }`, so the card always has something to decide on.
 */
export function renderTemplateOnce(hass: any, template: string, timeout = TIMEOUT): Promise<TemplateRender> {
  const connection = hass?.connection;
  if (typeof connection?.subscribeMessage !== 'function') {
    return Promise.resolve({ error: 'no connection to Home Assistant' });
  }

  return new Promise((resolve) => {
    let settled = false;
    let unsubscribe: (() => unknown) | undefined;

    // The result can arrive before subscribeMessage has handed over its unsubscribe, so
    // whichever comes second does the unsubscribing.
    const stop = (): void => {
      const unsub = unsubscribe;
      unsubscribe = undefined;
      if (!unsub) return;
      try {
        Promise.resolve(unsub()).catch(() => undefined);
      } catch {
        // A connection already gone has nothing left to unsubscribe from.
      }
    };
    const finish = (render: TemplateRender): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(render);
      stop();
    };
    const timer = setTimeout(() => finish({ error: 'no answer from Home Assistant' }), timeout);

    connection
      .subscribeMessage(
        (message: any) => {
          if (!message || typeof message !== 'object') return;
          if (Object.prototype.hasOwnProperty.call(message, 'result')) {
            finish({ result: message.result });
            return;
          }
          // With report_errors, Home Assistant sends warnings (an undefined variable, say)
          // ahead of the result, and an error instead of one. Only the error is the end.
          if (message.error !== undefined && message.level !== 'WARNING') finish({ error: String(message.error) });
        },
        { type: 'render_template', template, report_errors: true, strict: false },
      )
      .then((unsub: () => unknown) => {
        unsubscribe = unsub;
        if (settled) stop();
      })
      .catch((err: any) => finish({ error: String(err?.message ?? err?.code ?? err) }));
  });
}

/**
 * A rendered result as a list, or why it is not one. Home Assistant parses what a template
 * renders, so `| list` arrives as a real array; but a list joined into a bigger string, or
 * printed with Python's quotes, arrives as text - that is read as a list too when it is one.
 */
export function templateList(
  render: TemplateRender | undefined,
): { list: unknown[] } | { problem: 'error' | 'not_list'; detail: string } {
  if (!render) return { problem: 'error', detail: 'not rendered' };
  if ('error' in render) return { problem: 'error', detail: render.error };
  const { result } = render;
  if (Array.isArray(result)) return { list: result };
  if (typeof result === 'string') {
    const parsed = parseList(result);
    if (parsed) return { list: parsed };
  }
  const shown = typeof result === 'string' ? result : JSON.stringify(result);
  // Cut short: a template that rendered a page of text should not fill the console.
  return { problem: 'not_list', detail: String(shown).slice(0, 80) };
}

function parseList(text: string): unknown[] | undefined {
  const trimmed = text.trim();
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return undefined;
  for (const candidate of [trimmed, trimmed.replace(/'/g, '"')]) {
    try {
      const value = JSON.parse(candidate);
      if (Array.isArray(value)) return value;
    } catch {
      // Not this spelling; try the next.
    }
  }
  return undefined;
}

/** The template a source renders, when it is one. */
export function sourceTemplate(source: unknown): string | undefined {
  const template = (source as { template?: unknown } | undefined)?.template;
  return typeof template === 'string' && template.trim() ? template : undefined;
}
