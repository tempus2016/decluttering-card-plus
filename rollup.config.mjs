import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import serve from 'rollup-plugin-serve';
import json from '@rollup/plugin-json';
import { readFileSync } from 'fs';

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
      sourcemap: dev ? true : false,
    },
    plugins: [...plugins],
    watch: {
      exclude: 'node_modules/**',
    },
  },
];
