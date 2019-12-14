import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default [
  {
    input: 'temp/js/worker/wdtt-worker.js',
    output: {
      file: 'dist/js/worker/wdtt-worker.js',
      format: 'iife',
    },
    plugins: [
      resolve(),
      commonjs(),
    ]
  },
  {
    input: 'temp/js/worker/dexie.js',
    output: {
      file: 'dist/js/worker/dexie.js',
      format: 'iife',
    },
    plugins: [ resolve() ]
  },
];