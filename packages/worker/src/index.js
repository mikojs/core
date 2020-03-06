// @flow

import findMainServer from './utils/findMainServer';
import buildServer from './utils/buildServer';
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

  if (!mainServer) await buildServer(8000); // TODO: should use exec to running server in the background

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
