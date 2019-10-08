/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import debug from 'debug';
import { emptyFunction } from 'fbjs';

import configs from './utils/configs';
import sendToServer from './utils/sendToServer';

const debugLog = debug('configs:config');

/**
 * @example
 * config('cli', '/file-path')
 *
 * @param {string} cliName - cli name
 * @param {string} filePath - file path
 * @param {string} ignoreFilePath - ignore file path
 *
 * @return {object} - cli config
 */
export default (
  cliName: string,
  filePath: string,
  ignoreFilePath?: string,
): {} => {
  debugLog(`cliName: ${cliName}`);
  debugLog(`filePath: ${filePath}`);

  sendToServer.end(JSON.stringify({ pid: process.pid, filePath }), () => {
    debugLog(`${filePath} has been sent to the server`);
  });

  if (ignoreFilePath)
    sendToServer.end(
      JSON.stringify({ pid: process.pid, filePath: ignoreFilePath }),
      () => {
        debugLog(`${ignoreFilePath} has been sent to the server`);
      },
    );

  return (
    {}
    |> configs.addConfigsEnv
    |> configs.store[cliName].config || emptyFunction.thatReturnsArgument
    |> configs.removeConfigsEnv
  );
};
