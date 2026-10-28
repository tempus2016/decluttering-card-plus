/*
 * The browser suite's entry (idea 6): the stubs first, so the card finds hui-card and
 * friends as it loads, then the card and its editors, then the tests. scripts/dom-test.js
 * builds this file into one script, opens it in Chromium and reads window.__dcpResults.
 */
import { stubElements } from './stubs';

stubElements();

import '../../src/decluttering-card-plus';
import '../../src/editors';
import './regressions.test';
import './accessibility.test';
import { run } from './runner';

declare global {
  interface Window {
    __dcpResults?: unknown;
    __dcpRunning?: boolean;
  }
}

window.__dcpRunning = true;
run().then(
  (results) => {
    window.__dcpResults = results;
    window.__dcpRunning = false;
  },
  (err) => {
    window.__dcpResults = [{ name: 'suite', ok: false, error: String(err?.stack ?? err), ms: 0 }];
    window.__dcpRunning = false;
  },
);
