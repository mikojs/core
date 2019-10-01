/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import net from 'net';

import debug from 'debug';
import { emptyFunction } from 'fbjs';

import configs from 'utils/configs';

const debugLog = debug('configs:config');

/**
 * @example
 * config('cli', '/file-path')
 *
 * @param {string} cliName - cli name
 * @param {boolean} port - the port of the config server
 * @param {string} filePath - file path
 * @param {string} ignoreFilePath - ignore file path
 *
 * @return {object} - cli config
 */
export default (
  cliName: string,
  port: number,
  filePath: string,
  ignoreFilePath?: string,
): {} => {
  debugLog(`cliName: ${cliName}`);
  debugLog(`filePath: ${filePath}`);

  net
    .connect({ port })
    .end(JSON.stringify({ pid: process.pid, filePath }), () => {
      debugLog(`has sent ${filePath} to the server`);
    });

  if (ignoreFilePath)
    net
      .connect({ port })
      .end(
        JSON.stringify({ pid: process.pid, filePath: ignoreFilePath }),
        () => {
          debugLog(`has sent ${ignoreFilePath} to the server`);
        },
      );

  return (
    {}
    |> configs.addConfigsEnv
    |> configs.store[cliName].config || emptyFunction.thatReturnsArgument
    |> configs.removeConfigsEnv
  );
};
