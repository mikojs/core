// @flow

const lintStagedConfigs = require('./packages/configs/lib/lintsteged');

// copy dependencies before modifying package.json
lintStagedConfigs['package.json'].splice(
  0,
  0,
  'node ./lib/bin/copyDependencies',
);

module.exports = lintStagedConfigs;
