// @flow

import path from 'path';

import findProcess from 'find-process';

/**
 * @example
 * findMainServer()
 *
 * @return {object} - the pid and the port of the main server
 */
export default async (): Promise<{|
  pid: number,
  port: number,
|}> => {
  const [{ pid, cmd }] = (await findProcess(
    'name',
    path.resolve(__dirname, '../bin/createServer.js'),
  )).slice(-1);

  return {
    pid,
    port: cmd.split(/ /).slice(-1)[0],
  };
};
