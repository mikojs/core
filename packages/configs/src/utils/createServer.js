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
  let checkedTimes: number;

  const server = net.createServer((socket: net.Socket) => {
    socket.setEncoding('utf8');
    socket.on('data', (data: string) => {
      debugLog(data);

      const { pid, filePath } = JSON.parse(data);

      if (!cache[filePath]) cache[filePath] = [];

      cache[filePath].push(pid);
      debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);
      clearInterval(timer);

      checkedTimes = 0;
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

        if (!hasWorkingPids) {
          if (checkedTimes >= 5)
            server.close(async () => {
              await Promise.all(
                Object.keys(cache).map(async (cacheFilePath: string) => {
                  if (!fs.existsSync(cacheFilePath)) return;

                  await new Promise(resolve => {
                    rimraf(cacheFilePath, resolve);
                  });
                  debugLog(`Remove existing file: ${cacheFilePath}`);
                }),
              );

              clearInterval(timer);
              debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);
              debugLog('Close server');
            });

          checkedTimes += 1;
        }
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
