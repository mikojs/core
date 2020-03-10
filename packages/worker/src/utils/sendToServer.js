// @flow

import net from 'net';

import debug from 'debug';

const debugLog = debug('worker:sendToServer');
const TIMEOUT = 5000;
const RETRY_TIME = 20;

/**
 * @example
 * sendToServer(8000, '{}')
 *
 * @param {number} port - the port of the server
 * @param {string} clientData - the client data which will be sent to the server
 * @param {number} retryTimes - the times of the server retry
 *
 * @return {object} - response from the server
 */
const sendToServer = <+R>(
  port: number,
  clientData: string,
  retryTimes?: number = 0,
): Promise<?R> =>
  new Promise((resolve, reject) => {
    if (TIMEOUT / RETRY_TIME < retryTimes) reject(new Error('Timeout'));
    else {
      const client = net
        .connect(port)
        .setEncoding('utf8')
        .on('error', (err: Error) => {
          debugLog(err);
          setTimeout(() => {
            sendToServer(port, clientData, retryTimes + 1).then(resolve);
          }, RETRY_TIME);
        })
        .on('data', (serverData: string) => {
          debugLog(serverData);
          client.destroy();
          resolve(JSON.parse(serverData));
        })
        .on('close', () => {
          debugLog({ port, clientData });
          resolve();
        });

      client.write(clientData);
    }
  });

export default sendToServer;
