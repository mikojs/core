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
  const server = net.createServer((socket: net.Socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data: string) => {
      const { type, filePath, message } = JSON.parse(data);

      if (type === 'init') {
        if (!cache[filePath]) cache[filePath] = requireModule(filePath);
      }
      // eslint-disable-next-line flowtype/no-unused-expressions
      else cache[filePath]?.[type](message);
    });
  });

  server.on('error', (err: Error) => {
    debugLog(err);
    Object.keys(cache).forEach((key: string) => {
      // eslint-disable-next-line flowtype/no-unused-expressions
      cache[key]?.error(err);
    });
  });

  server.listen(port, () => {
    debugLog(`(${process.pid}) Open server at ${port}`);
  });
};
