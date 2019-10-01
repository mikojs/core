// @flow

import fs from 'fs';
import net from 'net';

import rimraf from 'rimraf';
import isRunning from 'is-running';
import debug from 'debug';

const debugLog = debug('configs:Server');

export type cacheType = {|
  pid: number,
  filePath: string,
|};

/**
 * @example
 * new createServer(8000)
 *
 * @param {number} port - the port of the server
 */
export default (port: number) => {
  let timer: IntervalID;
  const cache = {};

  const server = net.createServer((socket: net.Socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data: string) => {
      debugLog(data);

      const { pid, filePath } = JSON.parse(data);

      if (!cache[filePath]) cache[filePath] = { pids: [] };
      if (pid) cache[filePath].pids.push(pid);

      debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);
      clearInterval(timer);

      timer = setInterval(() => {
        Object.keys(cache).forEach((cacheFilePath: string) => {
          cache[cacheFilePath].pids = cache[cacheFilePath].pids.filter(
            isRunning,
          );

          if (cache[cacheFilePath].pids.length === 0) {
            if (fs.existsSync(cacheFilePath)) rimraf.sync(cacheFilePath);

            delete cache[cacheFilePath];

            debugLog(`Remove file: ${cacheFilePath}`);
            debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);
          }
        });

        if (Object.keys(cache).length === 0)
          server.close(() => {
            clearInterval(timer);
            debugLog('Close server');
          });
      }, 500);
    });
  });

  server.on('error', (err: mixed) => {
    debugLog(err);
  });

  server.listen(port, () => {
    debugLog(`Open server at ${port}`);
  });
};
