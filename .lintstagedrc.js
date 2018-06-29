// @flow

const lintStagedrc = require('./packages/configs/lib/lintstagedrc');

module.exports = {
  ...lintStagedrc,
  'package.json': [
    'node ./lib/copyDependencies',
    ...lintStagedrc['package.json'],
  ],
};
