// @flow

const lintStagedrc = require('./packages/configs/lib/lintstagedrc');

lintStagedrc['package.json'].splice(0, 0, 'node ./lib/copyDependencies');

module.exports = lintStagedrc;
