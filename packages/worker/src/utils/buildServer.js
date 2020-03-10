// @flow

import net from 'net';

import debug from 'debug';

import { requireModule } from '@mikojs/utils';

const debugLog = debug('worker:buildServer');

/**
 * @example
 * buildServer(8000)
 *
 * @param {number} port - the port of the server
 *
 * @return {object} - net server
 */
export default (port: number): net$Server => {
  const cache = {};
  let timer: TimeoutID;

  const server = net
    .createServer((socket: net.Socket) => {
      socket.setEncoding('utf8').on('data', (data: string) => {
        const { type, filePath, argv } = JSON.parse(data);

        if (type === 'init') {
          if (!cache[filePath]) {
            clearTimeout(timer);
            cache[filePath] = requireModule(filePath);
            cache[filePath].on('close', () => {
              timer = setTimeout(() => {
                delete cache[filePath];
                delete require.cache[filePath];

                if (Object.keys(cache).length !== 0) return;

                server.close(() => {
                  debugLog('Close server');
                });
              }, 5000);
            });
          }
          // FIXME
          // eslint-disable-next-line flowtype/no-unused-expressions
        } else cache[filePath]?.emit(type, ...argv);
      });
    })
    .on('error', (err: Error) => {
      debugLog(err);
      Object.keys(cache).forEach((key: string) => {
        cache[key].emit('error', err);
      });
    })
    .listen(port, () => {
      debugLog(`(${process.pid}) Open server at ${port}`);
    });

  return server;
};
