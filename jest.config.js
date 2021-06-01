const { resolve } = require('path');
module.exports = {
  preset: '@tongtian/jest-config-preset',
  testRunner: resolve('../../node_modules/jest-circus/runner.js'),
};
