// @flow

import path from 'path';

import findProcess from 'find-process';

/**
 * @example
 * findMainServer()
 *
 * @return {object} - the pid and the port of the main server
 */
export default async (): Promise<?{|
  pid: number,
  port: number,
|}> => {
  const [mainProcess] = (await findProcess(
    'name',
    path.resolve(__dirname, '../bin/createServer.js'),
  )).slice(-1);

  if (!mainProcess) return null;

  return {
    isMain: mainProcess.pid === process.pid,
    port: mainProcess.cmd.split(/ /).slice(-1)[0],
  };
};
