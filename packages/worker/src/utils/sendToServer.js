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
      let data: R;
      let type: 'start' | 'end' | 'error' | 'normal' | void;

      const client = net
        .connect({
          port,
          onread: {
            buffer: Buffer.alloc(4 * 1024),
            callback: (size: number, buffer: Buffer) => {
              const text = buffer.toString('utf8', 0, size);
              const matchType = text.match(/\[(start|end|error|normal)\]/)?.[0];

              if (!type)
                switch (matchType) {
                  case '[start]':
                    type = 'start';
                    break;

                  case '[end]':
                    type = 'end';
                    break;

                  case '[error]':
                    type = 'error';
                    break;

                  default:
                    type = 'normal';
                    break;
                }

              if (type !== 'end')
                data = `${data || ''}${text.replace(`[${type}]`, '')}`;

              if (matchType) {
                data = JSON.parse(data);
                type = undefined;
              }
            },
          },
        })
        .on('error', (err: Error) => {
          debugLog(err);
          setTimeout(() => {
            sendToServer(port, clientData, timeout, retryTimes + 1)
              .then(resolve)
              .catch(reject);
          }, RETRY_TIME);
        })
        .on('end', () => {
          debugLog({ port, clientData });
          resolve(data);
        });

      client.write(JSON.stringify(clientData));
    }
  });

export default sendToServer;
