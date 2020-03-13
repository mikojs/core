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
      let cache: ?string;
      let type: 'start' | 'end' | 'normal' | 'error';

      const client = net
        .connect({
          port,
          onread: {
            buffer: Buffer.alloc(1),
            callback: (size: number, buffer: Buffer) => {
              const text = buffer.toString('utf8', 0, size);

              if (text === ';')
                switch (cache) {
                  case 'start':
                  case 'end':
                  case 'normal':
                  case 'error':
                    type = cache;
                    cache = undefined;
                    return;

                  default:
                    break;
                }

              cache = `${cache || ''}${text}`;
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

          if (!cache)
            // $FlowFixMe R should can be void
            resolve(cache);
          else if (type === 'error') {
            const { message, stack } = JSON.parse(cache);
            const error = new Error(message);

            error.stack = stack;
            reject(error);
          } else resolve(JSON.parse(cache));
        });

      client.write(JSON.stringify(clientData));
    }
  });

export default sendToServer;
