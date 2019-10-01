// @flow

import fs from 'fs';
import net from 'net';

import rimraf from 'rimraf';
import isRunning from 'is-running';
import debug from 'debug';

const debugLog = debug('configs:Server');

/**
 * @example
 * new createServer(8000)
 *
 * @param {number} port - the port of the server
 */
export default (port: number) => {
  const cache = {};
  let timer: IntervalID;

  const server = net.createServer((socket: net.Socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data: string) => {
      debugLog(data);

      const { pid, filePath } = JSON.parse(data);

      if (!cache[filePath]) cache[filePath] = [];
      if (pid) cache[filePath].push(pid);

      debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);
      clearInterval(timer);

      timer = setInterval(() => {
        const hasWorkingPids = Object.keys(cache).reduce(
          (result: boolean, cacheFilePath: string): boolean => {
            const newPids = cache[cacheFilePath].filter(isRunning);

            if (newPids.length !== cache[cacheFilePath].length)
              debugLog(
                `Cache: ${JSON.stringify(
                  { ...cache, [cacheFilePath]: newPids },
                  null,
                  2,
                )}`,
              );

            cache[cacheFilePath] = newPids;

            return result || newPids.length !== 0;
          },
          false,
        );

        if (!hasWorkingPids)
          server.close(() => {
            Object.keys(cache).forEach((cacheFilePath: string) => {
              if (fs.existsSync(cacheFilePath)) {
                rimraf.sync(cacheFilePath);
                debugLog(`Remove existing file: ${cacheFilePath}`);
              }
            });

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
