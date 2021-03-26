// @flow

import findCacheDir from 'find-cache-dir';
import outputFileSync from 'output-file-sync';

import { requireModule } from '@mikojs/utils';

// $FlowFixMe FIXME: Owing to utils/configsCache use pipline
import { type configsType } from './getConfigs';

const cacheDir = findCacheDir({ name: '@mikojs/miko', thunk: true });

/**
 * @return {Array} - config files
 */
export default (): $ReadOnlyArray<string> => {
  const rootFilePath = cacheDir('index.js');

  outputFileSync(
    rootFilePath,
    `const { cosmiconfigSync } = require('cosmiconfig');

const getConfigs = require('@mikojs/miko/lib/refactor/getConfigs');

module.exports = getConfigs().load(cosmiconfigSync('miko').search()).cache;`,
  );

  // $FlowFixMe FIXME: Owing to utils/configsCache use pipline
  const root = requireModule<$PropertyType<configsType, 'cache'>>(rootFilePath);

  return Object.keys(root).map((key: string): string => {
    const configFilePath = cacheDir(`${key}.js`);

    outputFileSync(
      configFilePath,
      `module.exports = require('./index')['${key}']({});`,
    );

    return configFilePath;
  });
};
