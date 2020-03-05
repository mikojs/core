// @flow

import path from 'path';

import findProcess from 'find-process';
import debug from 'debug';

const debugLog = debug('configs:findMainServer');
let cachePid: number;

/**
 * @example
 * findMainServer()
 *
 * @return {object} - the pid and the port of the main server
 */
export default async (): Promise<?{|
  allProcesses: $Call<findProcess, string, string>,
  isMain: boolean,
  port: string,
|}> => {
  const allProcesses = await findProcess(
    'name',
    path.resolve(__dirname, '../bin/runServer.js'),
  );
  const [mainProcess] = allProcesses;

  if (!mainProcess) return null;

  if (mainProcess.pid !== cachePid) {
    cachePid = mainProcess.pid;
    debugLog(mainProcess);
    debugLog(process.pid);
  }

  return {
    allProcesses,
    isMain: mainProcess.pid === process.pid,
    port: mainProcess.cmd.split(/ /).slice(-1)[0],
  };
};
