
module.exports = {
  // This is a directory that should not be commited
  // to git and will be removed and rebuilt between
  // test runs.
  PACKAGE_BUILD_DIRNAME: 'build',


  // This is the environments that we should use for NODE_ENV.
  BUILD_TYPES: {
    dev: 'dev',
    prod: 'production',
  },
};


