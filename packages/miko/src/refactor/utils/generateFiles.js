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
  const mainFilePath = cacheDir('main.js');

  outputFileSync(
    mainFilePath,
    `const { cosmiconfigSync } = require('cosmiconfig');

const getConfigs = require('@mikojs/miko/lib/utils/getConfigs');

module.exports = getConfigs().load(cosmiconfigSync('miko').search()).cache;`,
  );

  // $FlowFixMe FIXME: Owing to utils/configsCache use pipline
  const main = requireModule<$PropertyType<configsType, 'cache'>>(mainFilePath);

  return Object.keys(main).map((key: string): string => {
    const configFilePath = cacheDir(`${key}.js`);

    outputFileSync(
      configFilePath,
      `module.exports = require('./main')['${key}'];`,
    );

    return configFilePath;
  });
};
