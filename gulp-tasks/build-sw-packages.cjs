
const {parallel, series} = require('gulp');
const {rollup} = require('rollup');
const fse = require('fs-extra');
const ol = require('common-tags').oneLine;
const upath = require('upath');
const constants = require('./utils/constants');
const logHelper = require('./utils/log-helper');
const rollupHelper = require('./utils/rollup-helper');

// This makes Rollup assume workbox-* will be added to the global
// scope and replace references with the core namespace.
function globals(moduleId) {
  if (moduleId === 'workbox') {
    return moduleId;
  }

  const splitImportPath = moduleId.split('/');
  if (splitImportPath[0].indexOf('workbox-') !== 0) {
    throw new Error(`Unknown global module ID: ${moduleId}`);
  }

  const packageName = splitImportPath.shift();
  const packagePath = upath.join(__dirname, '..', 'node_modules', packageName);

  const namespacePathParts = splitImportPath.map((importPathPiece) => {
    // The browser namespace will need the file extension removed
    return upath.basename(importPathPiece, upath.extname(importPathPiece));
  });

  if (namespacePathParts.length === 0) {
    // Tried to pull in default export of module - this isn't allowed.
    // A specific file must be referenced
    throw new Error(ol`You cannot use a module directly. Instead, you must
        specify a named import, to facilitate tree-shaking. Please fix the
        import: '${moduleId}'`);
  }

  let additionalNamespace;
  if (namespacePathParts.length > 1) {
    if (namespacePathParts[0] !== '_private' || namespacePathParts.length > 2) {
      // Tried to pull in default export of module - this isn't allowed.
      // A specific file must be referenced
      throw new Error(ol`You cannot use nested files. It must be a top level
          (and public) file or a file under '_private' in a module. Please fix
          the import: '${moduleId}'`);
    }
    additionalNamespace = namespacePathParts[0];
  }

  // Get a package's browserNamespace so we know where it will be
  // on the global scope (i.e. workbox.<browserNamespace>)
  try {
    const pkg = require(upath.join(packagePath, 'package.json'));
    return [pkg.workbox.browserNamespace, additionalNamespace]
      .filter((value) => value && value.length > 0)
      .join('.');
  } catch (err) {
    logHelper.error(`Unable to get browserNamespace for '${packageName}'`);
    throw err;
  }
}

// This ensures all workbox-* modules are treated as external and are
// referenced as globals.
function externalAndPure(importPath) {
  return importPath.indexOf('workbox-') === 0;
}

async function build_bundle() {
  const packageIndex = upath.join('./src', 'index.mjs');

  // First check if the bundle file exists, if it doesn't
  // there is nothing to build
  if (!(await fse.exists(packageIndex))) {
    throw new Error(`Could not find ${packageIndex}`);
  }

  const pkgJson = require(upath.join('..', 'package.json'));
  if (!pkgJson.workbox || !pkgJson.workbox.browserNamespace) {
    throw new Error(ol`You must define a 'workbox.browserNamespace' property in
        package.json`);
  }

  let outputFilename = pkgJson.workbox.outputFilename;
  outputFilename += '.js';

  const namespace = pkgJson.workbox.browserNamespace;
  const outputDirectory = upath.join(
    '.',
    constants.PACKAGE_BUILD_DIRNAME,
  );

  const plugins = rollupHelper.getDefaultPlugins(constants.BUILD_TYPES.prod);

  const bundle = await rollup({
    input: packageIndex,
    external: externalAndPure,
    treeshake: {
      moduleSideEffects: externalAndPure ? 'no-external' : false,
    },
    plugins,
    onwarn: (warning) => {
      if (
        warning.code === 'UNUSED_EXTERNAL_IMPORT'
      ) {
        // This can occur when using rollup-plugin-replace.
        logHelper.warn(`[${warning.code}] ${warning.message}`);
        return;
      }

      // The final builds should have no warnings.
      if (warning.code && warning.message) {
        throw new Error(
          `Unhandled Rollup Warning: [${warning.code}] ` + `${warning.message}`,
        );
      } else {
        throw new Error(`Unhandled Rollup Warning: ${warning}`);
      }
    },
  });

  await bundle.write({
    file: upath.join(outputDirectory, outputFilename),
    name: namespace,
    sourcemap: true,
    format: 'iife',
    globals,
    esModule: false,
  });
}

module.exports = {
  build_bundle,
};
