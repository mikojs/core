// @flow

import buildTesting, {
  type optionsType as buildTestingOptionsType,
  type returnType as buildTestingReturnType,
} from './utils/buildTesting';

type optionsType = buildTestingOptionsType;

type returnType = {|
  testing: buildTestingReturnType,
|};

/**
 * @param {optionsType} options - build options
 *
 * @return {returnType} - server functions
 */
export default ({ dev, prod }: buildTestingOptionsType): returnType => ({
  testing: buildTesting({ dev, prod }),
});
