/*
 * The browser suite's runner (idea 6): describe/it in the browser, results on the window
 * for scripts/dom-test.js to read back. Small on purpose - the test server a bigger runner
 * wants is not reachable from the browser that runs these (see scripts/dom-test.js).
 */
import { expect } from 'chai';

export { expect };

export interface DomResult {
  name: string;
  ok: boolean;
  error?: string;
  ms: number;
}

interface Registered {
  name: string;
  fn: () => void | Promise<void>;
}

const registered: Registered[] = [];
const prefixes: string[] = [];

export function describe(name: string, body: () => void): void {
  prefixes.push(name);
  try {
    body();
  } finally {
    prefixes.pop();
  }
}

export function it(name: string, fn: () => void | Promise<void>): void {
  registered.push({ name: [...prefixes, name].join(' › '), fn });
}

/** Waits for the given number of animation frames, plus a macrotask, so Lit and observers settle. */
export async function settle(frames = 3): Promise<void> {
  for (let i = 0; i < frames; i++) await new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)));
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/** Waits until `condition` holds, or fails after `timeout` ms. */
export async function until(condition: () => boolean, timeout = 2000, what = 'condition'): Promise<void> {
  const started = performance.now();
  while (!condition()) {
    if (performance.now() - started > timeout) throw new Error(`timed out waiting for ${what}`);
    await settle(1);
  }
}

export async function run(): Promise<DomResult[]> {
  const results: DomResult[] = [];
  for (const test of registered) {
    const started = performance.now();
    try {
      await test.fn();
      results.push({ name: test.name, ok: true, ms: performance.now() - started });
    } catch (err) {
      results.push({
        name: test.name,
        ok: false,
        error: err instanceof Error ? (err.stack ?? err.message) : String(err),
        ms: performance.now() - started,
      });
    }
    // Each test leaves the page as it found it.
    document.body.replaceChildren();
  }
  return results;
}
