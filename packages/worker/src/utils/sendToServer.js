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
 * @param {string} data - the data which will be sent to the server
 * @param {number} retryTimes - the times of the server retry
 *
 * @return {void} - not return anything
 */
const sendToServer = (port: number, data: string, retryTimes?: number = 0) =>
  new Promise<void>((resolve, reject) => {
    if (TIMEOUT / RETRY_TIME < retryTimes) reject(new Error('Timeout'));
    else
      net
        .connect(parseInt(port, 10))
        .on('error', (err: Error) => {
          debugLog(err);
          setTimeout(() => {
            sendToServer(port, data, retryTimes + 1).then(resolve);
          }, RETRY_TIME);
        })
        .end(data, resolve);
  });

export default sendToServer;
