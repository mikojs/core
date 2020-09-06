// @flow

import net from 'net';
import stream from 'stream';

import debug from 'debug';

type clientDataType = {|
  type: string,
  filePath: string,
  argv: $ReadOnlyArray<mixed>,
|};

const debugLog = debug('worker:sendToServer');
const TIMEOUT = 5000;
const RETRY_TIME = 20;

/**
 * @param {number} port - the port of the server
 * @param {clientDataType} clientData - the client data which will be sent to the server
 * @param {number} timeout - timeout of checking
 * @param {number} retryTimes - the times of the server retry
 *
 * @return {object} - response from the server
 */
const sendToServer = <+R>(
  port: number,
  clientData: clientDataType,
  timeout?: number = TIMEOUT,
  retryTimes?: number = 0,
): Promise<R> =>
  new Promise((resolve, reject) => {
    if (timeout / RETRY_TIME < retryTimes) reject(new Error('Timeout'));
    else {
      const hasStdout = clientData.argv[0] instanceof stream.Writable;
      let cache: ?string;
      let type: 'start' | 'end' | 'normal' | 'error' | 'stdout';

      net
        .connect({
          port,
          onread: {
            buffer: Buffer.alloc(1),

            /**
             * @param {number} size - buffer size
             * @param {Buffer} buffer - buffer array
             */
            callback: (size: number, buffer: Buffer) => {
              const text = buffer.toString('utf8', 0, size);

              if (text === ';')
                switch (cache) {
                  case 'start':
                  case 'end':
                  case 'normal':
                  case 'error':
                  case 'stdout':
                    type = cache;
                    cache = undefined;
                    return;

                  default:
                    break;
                }

              cache = `${cache || ''}${text}`;

              if (type === 'stdout' && cache.length === 'normal;'.length) {
                // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/7702
                clientData.argv[0].write(cache[0]);
                cache = cache.slice(1);
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

          if (!cache)
            // $FlowFixMe R should can be void
            resolve(cache);
          else if (type !== 'error') resolve(JSON.parse(cache));
          else {
            const { message, stack } = JSON.parse(cache);
            const error = new Error(message);

            error.stack = stack;
            reject(error);
          }
        })
        .write(JSON.stringify({ ...clientData, hasStdout }));
    }
  });

export default sendToServer;
