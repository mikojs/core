// @flow

import path from 'path';

import findProcess from 'find-process';
import debug from 'debug';

type returnType = {|
  isMain: boolean,
  port: string,
|};

const debugLog = debug('worker:findMainServer');
let cachePid: number;

/**
 * @example
 * findMainServer()
 *
 * @return {returnType} - a boolean to show if this process is the main server or not and the port of the main server
 */
export default async (): Promise<?returnType> => {
  const allProcesses = await findProcess(
    'name',
    path.resolve(__dirname, '../bin/index.js'),
  );
  const [mainProcess] = allProcesses;

  if (!mainProcess) return null;

  if (mainProcess.pid !== cachePid) {
    cachePid = mainProcess.pid;
    debugLog(mainProcess);
    debugLog(process.pid);
  }

  return {
    isMain: mainProcess.pid === process.pid,
    port: mainProcess.cmd.split(/ /).slice(-1)[0],
  };
};
