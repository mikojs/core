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
  isMain: boolean,
  port: string,
|}> => {
  const [mainProcess] = await findProcess(
    'name',
    path.resolve(__dirname, '../bin/runServer.js'),
  );

  if (!mainProcess) return null;

  return {
    isMain: mainProcess.pid === process.pid,
    port: mainProcess.cmd.split(/ /).slice(-1)[0],
  };
};
