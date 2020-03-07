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
 */
export default (port: number) => {
  const cache = {};
  let timer: TimeoutID;

  const server = net.createServer((socket: net.Socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data: string) => {
      const { type, filePath, argv } = JSON.parse(data);

      if (type === 'init') {
        if (!cache[filePath]) {
          clearTimeout(timer);
          cache[filePath] = requireModule(filePath);
          cache[filePath].on('close', () => {
            delete cache[filePath];
            delete require.cache[filePath];

            if (Object.keys(cache).length !== 0) return;

            timer = setTimeout(() => {
              server.close(() => {
                debugLog('Close server');
              });
            }, 5000);
          });
        }
      } else cache[filePath].emit(type, ...argv);
    });
  });

  server.on('error', (err: Error) => {
    debugLog(err);
    Object.keys(cache).forEach((key: string) => {
      if (cache[key].eventNames().includes('error'))
        cache[key].emit('error', err);
    });
  });

  server.listen(port, () => {
    debugLog(`(${process.pid}) Open server at ${port}`);
  });
};
