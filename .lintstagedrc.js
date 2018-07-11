// @flow

const lintStagedConfigs = require('./packages/configs/lib/lintsteged');

// copy dependencies before modifying package.json
lintStagedConfigs['package.json'].splice(
  0,
  0,
  'node ./lib/bin/copyDependencies',
);

// copy dependencies before modifying package.json
lintStagedConfigs['package.json'].splice(
  0,
  0,
  'node ./lib/bin/modifyPackagesPkg',
);

module.exports = lintStagedConfigs;
