// import {terser} from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import OMT from '@surma/rollup-plugin-off-main-thread';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from '@rollup/plugin-json';

import { build } from './gulp-tasks/build.mjs';

build();


const SRC_DIR   = 'src';
const BUILD_DIR = 'dist';

export default {
  input: [`${SRC_DIR}/ZitiFirstStrategy.ts`],
  plugins: [
    commonjs(),
    json(),
    nodeResolve({
      preferBuiltins: false
    }),
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
    replace({
      'preventAssignment': true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    }),
    typescript({
      outputToFilesystem: true // Explicitly setting to true (or false if needed)
    }),
    OMT(),
    // workboxInjectManifest({
    //   globDirectory: BUILD_DIR,
    //   globPatterns: [
    //     '*.js',
    //   ],
    //   "globIgnores": [
    //     "**/node_modules/**/*",
    //     "*.map",
    //   ]
    // }),
    // terser(),
  ],
  output: {
    sourcemap: false,
    format: 'amd',
    dir: BUILD_DIR,
  },
};
