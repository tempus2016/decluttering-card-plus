import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';
import { readFileSync } from 'fs';
import { resolve as resolvePath } from 'path';

const { version } = JSON.parse(readFileSync('./package.json', 'utf8'));

// src/version.ts holds a placeholder so the module type-checks; the real value comes from
// package.json at build time. Without this the banner keeps whatever was hardcoded, and
// semantic-release only ever rewrites package.json.
const injectVersion = {
  name: 'inject-version',
  transform(code, id) {
    if (!id.replace(/\\/g, '/').endsWith('src/version.ts')) return null;
    return { code: `export const VERSION = '${version}';`, map: null };
  },
};

const dev = process.env.ROLLUP_WATCH;

// The modules reachable from the card's entry through static imports only - the dynamic
// imports (the editors, the languages) start chunks of their own. Worked out once per build.
const ENTRY_ID = resolvePath('src/decluttering-card-plus.ts');
let coreCache;
function coreModules(getModuleInfo) {
  if (coreCache) return coreCache;
  const core = new Set();
  const queue = [ENTRY_ID];
  while (queue.length) {
    const info = getModuleInfo(queue.shift());
    if (!info) continue;
    for (const next of info.importedIds) {
      if (!core.has(next)) {
        core.add(next);
        queue.push(next);
      }
    }
  }
  coreCache = core;
  return core;
}
// A watch rebuild may import something new, so the set is worked out again for every build.
const resetCore = {
  name: 'reset-core',
  buildStart() {
    coreCache = undefined;
  },
};

const serveopts = {
  contentBase: ['./dist'],
  host: '0.0.0.0',
  port: 5000,
  allowCrossOrigin: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const plugins = [
  injectVersion,
  nodeResolve({}),
  commonjs(),
  // Explicit include: rollup-plugin-typescript2's default include patterns use the
  // extglob `*.ts+(|x)`, which picomatch >= 2.3.2 no longer matches. That silently
  // disables transpilation and the build fails with "Unexpected token" on TS syntax.
  typescript({
    include: ['**/*.ts', '**/*.tsx'],
  }),
  json(),
  dev && serve(serveopts),
  !dev &&
    terser({
      // format: {
      //   comments: false,
      // },
      mangle: {
        safari10: true,
      },
    }),
];

export default [
  {
    input: 'src/decluttering-card-plus.ts',
    output: {
      dir: './dist',
      format: 'es',
      // Always, so a stack trace from somebody's console points at a TypeScript line (idea
      // 13). The map sits beside the bundle in dist/ and on the release; HACS copies only
      // the bundle, and a browser that cannot fetch the map simply shows the minified line.
      sourcemap: true,
      // The editors are a chunk of their own (idea 4), loaded by the main file with a relative
      // import, so it lives beside it under a name HACS downloads along with the main file:
      // every .js in dist/ travels. The hash changes with the content, so a browser that kept
      // the old main file never loads a chunk it was not built with.
      chunkFileNames: 'decluttering-card-plus.[name]-[hash].js',
      /*
       * Everything the entry reaches statically goes into one `core` chunk, so the entry file
       * Home Assistant loads is a stub that imports core and nothing else imports the entry.
       * Without this the editors chunk imported `./decluttering-card-plus.js` by its plain
       * name while Home Assistant had loaded it as `...js?v=N` (HACS: `?hacstag=N`), and the
       * browser, which keys modules by full URL, ran the main module a second time: two
       * warning logs, two example registries, two build logs, each half empty.
       */
      manualChunks(id, { getModuleInfo }) {
        return coreModules(getModuleInfo).has(id) ? 'core' : undefined;
      },
    },
    plugins: [resetCore, ...plugins],
    watch: {
      exclude: 'node_modules/**',
    },
  },
  // The template builder on the docs site. Committed, like dist/, because the Pages build
  // copies docs-theme/ as it is and runs no npm.
  {
    input: 'src/builder-page.ts',
    output: {
      file: './docs-theme/assets/js/builder.js',
      format: 'iife',
      // One file: the language chunks the card build splits off are folded back in here.
      inlineDynamicImports: true,
    },
    plugins: plugins.filter((plugin) => plugin && plugin.name !== 'serve'),
  },
  // "Try a placeholder", the other docs-site tool, committed for the same reason.
  {
    input: 'src/playground-page.ts',
    output: {
      file: './docs-theme/assets/js/playground.js',
      format: 'iife',
      inlineDynamicImports: true,
    },
    plugins: plugins.filter((plugin) => plugin && plugin.name !== 'serve'),
  },
];
