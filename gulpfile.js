
// const globby = require('globby');
import { globby } from 'globby';


// const taskFiles = globby.sync('./gulp-tasks/*.js');
async function getFiles() {
  return await globby(['./gulp-tasks/*.cjs']);
}

const taskFiles = await getFiles();
console.log('taskFiles: ', taskFiles);


for (const taskFile of taskFiles) {
  const taskDefinitions = require(taskFile);
  for (const [name, task] of Object.entries(taskDefinitions)) {
    if (name === 'functions') {
      continue;
    }
    if (name in module.exports) {
      throw new Error(
        `Duplicate task definition: ${name} defined in` +
          ` ${taskFile} conflicts with another task.`,
      );
    }
    module.exports[name] = task;
  }
}
