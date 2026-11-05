/*
 * Idea 25: Home Assistant 2026.7 no longer exports Decoration, ViewPlugin and StateEffect from
 * ha-code-editor's loaded CodeMirror. codeMirrorClasses finds the editor's own copies through
 * what it still exports; this checks each route with stand-ins shaped like CodeMirror's.
 */
import { describe, it, expect } from './runner';
import { codeMirrorClasses } from '../../src/template-editor/code-editor-hooks';

class StateEffectLike {
  static appendConfig = { of: (): unknown => ({}) };
}
class ViewPluginLike {
  static fromClass(): unknown {
    return new ViewPluginLike();
  }
}
class DecorationLike {
  static mark(): unknown {
    return {};
  }
  static set(): unknown {
    return {};
  }
  static none = {};
}
class LineDecorationLike extends DecorationLike {}

describe('finding CodeMirror classes', () => {
  it('takes the exports when Home Assistant still makes them', () => {
    const cm = { Decoration: DecorationLike, ViewPlugin: ViewPluginLike, StateEffect: StateEffectLike };
    const found = codeMirrorClasses(cm, undefined);
    expect(found.Decoration).to.equal(DecorationLike);
    expect(found.ViewPlugin).to.equal(ViewPluginLike);
    expect(found.StateEffect).to.equal(StateEffectLike);
  });

  it('reaches them through a compartment, the active-line extension and its decoration', () => {
    const activeLine = new ViewPluginLike();
    const cm = {
      langCompartment: { reconfigure: (): unknown => new StateEffectLike() },
      highlightActiveLine: (): unknown => activeLine,
    };
    const view = {
      state: { doc: { length: 10 } },
      plugin: (p: unknown): unknown =>
        p === activeLine
          ? {
              decorations: {
                between: (_f: number, _t: number, fn: (a: number, b: number, v: unknown) => boolean): void => {
                  fn(0, 0, new LineDecorationLike());
                },
              },
            }
          : undefined,
    };
    const found = codeMirrorClasses(cm, view);
    expect(found.StateEffect).to.equal(StateEffectLike);
    expect(found.ViewPlugin).to.equal(ViewPluginLike);
    expect(found.Decoration).to.equal(DecorationLike);
  });

  it('gives up quietly when nothing is there, so the coloured copy stands in', () => {
    const found = codeMirrorClasses({}, { state: { doc: { length: 0 } }, plugin: (): undefined => undefined });
    expect(found.Decoration).to.equal(undefined);
    expect(found.ViewPlugin).to.equal(undefined);
    expect(found.StateEffect).to.equal(undefined);
  });
});
