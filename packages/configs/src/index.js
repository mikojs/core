/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import debug from 'debug';
import { emptyFunction } from 'fbjs';

import { handleUnhandledRejection } from '@mikojs/utils';

import configs from './utils/configs';
import sendToServer from './utils/sendToServer';

const debugLog = debug('configs:config');

handleUnhandledRejection();

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
  debugLog({ cliName, filePath, ignoreFilePath });

  sendToServer(JSON.stringify({ pid: process.pid, filePath }), () => {
    debugLog(`${filePath} has been sent to the server`);
  }).catch(debugLog);

  if (ignoreFilePath)
    sendToServer(
      JSON.stringify({ pid: process.pid, filePath: ignoreFilePath }),
      () => {
        debugLog(`${ignoreFilePath} has been sent to the server`);
      },
    ).catch(debugLog);

  return (
    {} |> configs.store[cliName].config || emptyFunction.thatReturnsArgument
  );
};
