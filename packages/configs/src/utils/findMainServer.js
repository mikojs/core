// @flow

import path from 'path';

import findProcess from 'find-process';
import debug from 'debug';

const debugLog = debug('configs:findMainServer');

/**
 * @example
 * findMainServer()
 *
 * @return {object} - the pid and the port of the main server
 */
export default async (): Promise<?{|
  isMain: boolean,
  port: string,
|}> => {
  const [mainProcess] = await findProcess(
    'name',
    path.resolve(__dirname, '../bin/runServer.js'),
  );

  debugLog(mainProcess);

  if (!mainProcess) return null;

  return {
    isMain: mainProcess.pid === process.pid,
    port: mainProcess.cmd.split(/ /).slice(-1)[0],
  };
};
