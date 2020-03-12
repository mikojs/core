// @flow

import net from 'net';
import crypto from 'crypto';

import debug from 'debug';

const debugLog = debug('worker:sendToServer');
const TIMEOUT = 5000;
const RETRY_TIME = 20;

/**
 * @example
 * sendToServer(8000, '{}')
 *
 * @param {number} port - the port of the server
 * @param {object} clientData - the client data which will be sent to the server
 * @param {number} timeout - timeout of checking
 * @param {number} retryTimes - the times of the server retry
 *
 * @return {object} - response from the server
 */
const sendToServer = <+R>(
  port: number,
  clientData: {},
  timeout?: number = TIMEOUT,
  retryTimes?: number = 0,
): Promise<R> =>
  new Promise((resolve, reject) => {
    if (timeout / RETRY_TIME < retryTimes) reject(new Error('Timeout'));
    else {
      let data: R & { hash: string, message: string, stack: string };
      const hash = crypto
        .createHash('md5')
        .update(process.pid.toString())
        .digest('hex');
      const client = net
        .connect(port)
        .setEncoding('utf8')
        .on('error', (err: Error) => {
          debugLog(err);
          setTimeout(() => {
            sendToServer(port, clientData, timeout, retryTimes + 1)
              .then(resolve)
              .catch(reject);
          }, RETRY_TIME);
        })
        .on('data', (serverData: string) => {
          debugLog(serverData);
          data = JSON.parse(serverData);
        })
        .on('end', () => {
          debugLog({ port, clientData });

          if (data?.hash !== hash) resolve(data);
          else {
            const error = new Error(data.message);

            error.stack = data.stack;
            reject(error);
          }
        });

      client.write(
        JSON.stringify({
          ...clientData,
          hash,
        }),
      );
    }
  });

export default sendToServer;
