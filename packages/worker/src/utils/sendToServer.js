// @flow

import net from 'net';

import debug from 'debug';

import findMainServer from './findMainServer';

const debugLog = debug('worker:sendToServer');

/**
 * @example
 * sendToServer('{}', () => {})
 *
 * @param {string} data - the data which will be sent to the server
 */
const sendToServer = async (data: string) => {
  const mainServer = await findMainServer();
  const client = net.connect(parseInt(mainServer?.port || -1, 10));

  await new Promise<void>(resolve => {
    client.on('error', (err: Error) => {
      debugLog(err);
      setTimeout(() => {
        sendToServer(data).then(resolve);
      }, 10);
    });

    client.end(data, resolve);
  });
};

export default sendToServer;
