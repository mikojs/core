// @flow

import merge from './merge';
import { type originalConfigsType, type configsType } from './index';

/**
 * @example
 * walker(configs)
 *
 * @param {originalConfigsType} configs - original configs
 * @param {Array} prevKeys - prev keys array
 *
 * @return {configsType} - merged new configs
 */
const walker = (
  configs: originalConfigsType,
  prevKeys?: $ReadOnlyArray<string> = [],
) =>
  Object.keys(configs).reduce(
    (result: configsType, key: string): configsType => {
      const newKey = [...prevKeys, key].join(':');

      if (typeof configs[key] === 'function')
        return merge(result, { [newKey]: [configs[key], {}] });

      if (configs[key] instanceof Array)
        return merge(result, { [newKey]: configs[key] });

      return merge(result, walker(configs[key], [...prevKeys, key]));
    },
    {},
  );

export default walker;
