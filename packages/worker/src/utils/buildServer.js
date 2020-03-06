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
  const cache = {
    errors: [],
  };
  const server = net.createServer((socket: net.Socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data: string) => {
      const { filePath } = JSON.parse(data);
      const { error } = requireModule(filePath);

      cache.errors.push(error);
    });
  });

  server.on('error', (err: Error) => {
    debugLog(err);
    cache.errors.forEach((callback: (err: Error) => void) => {
      callback(err);
    });
  });

  server.listen(port, () => {
    debugLog(`(${process.pid}) Open server at ${port}`);
  });
};
