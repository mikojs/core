// @flow

import path from 'path';

import execa from 'execa';
import getPort from 'get-port';

import findMainServer from './utils/findMainServer';
import sendToServer from './utils/sendToServer';

type returnType = (type: string, data: {}) => Promise<void>;

/**
 * @example
 * worker('/filePath')
 *
 * @param {string} filePath - file path
 *
 * @return {returnType} - worker function
 */
export default async (filePath: string): Promise<returnType> => {
  const mainServer = await findMainServer();

  if (!mainServer)
    execa(path.resolve(__dirname, './bin/index.js'), [await getPort()], {
      detached: true,
      stdio: 'ignore',
    }).unref();

  await sendToServer(
    JSON.stringify({
      type: 'init',
      filePath,
    }),
  );

  return (type: string, message: {}) =>
    sendToServer(
      JSON.stringify({
        type,
        filePath,
        message,
      }),
    );
};
