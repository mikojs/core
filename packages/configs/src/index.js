/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import moment from 'moment';
import debug from 'debug';
import { emptyFunction } from 'fbjs';

import configs from 'utils/configs';
import worker from 'utils/worker';

const debugLog = debug('configs:config');

/**
 * @example
 * config('cli', '/file-path')
 *
 * @param {string} cliName - cli name
 * @param {string} filePath - file path
 *
 * @return {object} - cli config
 */
export default (cliName: string, filePath: string): {} => {
  debugLog(`cliName: ${cliName}`);
  debugLog(`filePath: ${filePath}`);
  worker.writeCache({ filePath, using: moment().format() });

  return (
    {}
    |> configs.addConfigsEnv
    |> configs.store[cliName].config || emptyFunction.thatReturnsArgument
    |> configs.removeConfigsEnv
  );
};
