
import del from 'del';
import fse from 'fs-extra';
import upath from 'upath';
import execa from 'execa';
import { promisify } from 'util';
// import { glob } from 'glob';
import pkg from 'glob';
const { glob } = pkg;

// const {build_bundle} = require('./build-sw-packages');

const asyncGlob = promisify(glob);

async function getJsFiles() {
  try {
    const jsFiles = await asyncGlob('src/*.js', {
      ignore: ['**/build/**'],
    });

    console.log(jsFiles);
    return jsFiles;
  } catch (error) {
    console.error('Error finding files:', error);
  }
}


async function cleanSequence() {
  console.log('cleanSequence() entered')
  // Delete generated files from the the TypeScript transpile.
  if (await fse.pathExists(upath.join('.', 'src', 'index.ts'))) {
    await del([
      `./src/*.+(js|mjs|d.ts)`,
      // Don't delete files in node_modules.
      '!**/node_modules/**/*',
    ]);
  }

  // Delete build files.
  await del(upath.join('.', 'build'));

  // Delete tsc artifacts (if present).
  await del(upath.join('.', 'tsconfig.tsbuildinfo'));
}

async function transpile_typescript() {
  await execa('tsc', ['--build', 'tsconfig.json'], {preferLocal: true});

  // const jsFiles = await globby(`src/*.js`, {
  //   ignore: ['**/build/**'],
  // });

  const jsFiles = await getJsFiles();


  for (const jsFile of jsFiles) {
    const {dir, name} = upath.parse(jsFile);
    const mjsFile = upath.join(dir, `${name}.mjs`);
    const mjsSource = `export * from './${name}.js';`;
    await fse.outputFile(mjsFile, mjsSource);
  }
}


async function build() {
  await cleanSequence();
  await transpile_typescript();
}


// module.exports = {
//   build: series(
//     cleanSequence,
//     transpile_typescript,
//     // build_bundle,
//   ),
//   clean: cleanSequence,
// };

export {
  build
};
