
const {series} = require('gulp');
const del = require('del');
const fse = require('fs-extra');
const upath = require('upath');
const constants = require('./utils/constants');
const {transpile_typescript} = require('./transpile-typescript');
const {build_bundle} = require('./build-sw-packages');


async function cleanSequence() {
  // Delete generated files from the the TypeScript transpile.
  if (await fse.pathExists(upath.join('.', 'src', 'index.ts'))) {
    await del([
      `./src/*.+(js|mjs|d.ts)`,
      // Don't delete files in node_modules.
      '!**/node_modules/**/*',
    ]);
  }

  // Delete build files.
  await del(upath.join('.', constants.PACKAGE_BUILD_DIRNAME));

  // Delete tsc artifacts (if present).
  await del(upath.join('.', 'tsconfig.tsbuildinfo'));
}


module.exports = {
  build: series(
    cleanSequence,
    transpile_typescript,
    build_bundle,
  ),
  clean: cleanSequence,
};
