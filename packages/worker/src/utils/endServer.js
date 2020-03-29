// @flow

import path from 'path';

import findProcess from 'find-process';

import sendToServer from './sendToServer';

/**
 * @example
 * endServer('/filePath')
 *
 * @param {string} filePath - file path
 * @param {number} timeout - timeout setting
 */
export default async (filePath: string, timeout?: number) => {
  const [mainProcess] = await findProcess(
    'name',
    path.resolve(__dirname, '../bin/index.js'),
  );
  const port = mainProcess?.cmd.split(/ /).slice(-1)[0];

  if (!port) return;

  await sendToServer(
    port,
    {
      type: 'end',
      filePath,
      argv: [],
    },
    timeout,
  );
};
