// @flow

const lintStagedConfigs = require('./packages/configs/lib/lintsteged');

lintStagedConfigs['package.json'].splice(0, 0, 'node ./lib/copyDependencies');

module.exports = lintStagedConfigs;
