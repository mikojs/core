// @flow

import buildDev, {
  type returnType as buildDevReturnType,
} from './utils/buildDev';
import buildProd, {
  type returnType as buildProdReturnType,
} from './utils/buildProd';
import buildTesting, {
  type optionsType as buildTestingOptionsType,
  type returnType as buildTestingReturnType,
} from './utils/buildTesting';

type optionsType = buildTestingOptionsType;

type returnType = {|
  dev: buildDevReturnType,
  prod: buildProdReturnType,
  testing: buildTestingReturnType,
  setConfig: (config: { [string]: mixed }) => void,
|};

const config = {
  folderPath: process.cwd(),
};

/**
 * @param {optionsType} options - build options
 *
 * @return {returnType} - server functions
 */
export default ({ dev, prod }: buildTestingOptionsType): returnType => ({
  dev: buildDev(dev, config),
  prod: buildProd(prod, config),
  testing: buildTesting({ dev, prod }),
  setConfig: (newConfig: { [string]: mixed }) => {
    Object.keys(newConfig).forEach((key: string) => {
      config[key] = newConfig[key];
    });
  },
});
