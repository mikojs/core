// @flow

import { type Config as ConfigType } from 'relay-compiler/bin/RelayCompilerMain.js.flow';

import { type optionsType as graphqlOptionsType } from '../index';

export type optionsType = ConfigType & graphqlOptionsType;

/**
 * @param {optionsType} options - command options
 * @param {Array} keys - filter keys
 *
 * @return {object} - filtered options
 */
export default <O: {}>(
  options: optionsType,
  keys: $ReadOnlyArray<$Keys<O>>,
): O =>
  keys.reduce(
    (result: O, key: $Keys<O>) => ({
      ...result,
      [key]: options[key],
    }),
    // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/5332
    ({}: O),
  );
