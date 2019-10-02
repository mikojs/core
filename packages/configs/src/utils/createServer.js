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

      let isRemoving: boolean = false;

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
          if (checkedTimes >= 20)
            server.close(() => {
              clearInterval(timer);
              debugLog('Close server');
            });
          else if (checkedTimes >= 5 && Object.keys(cache).length !== 0) {
            if (!isRemoving) {
              const [removeFilePath] = Object.keys(cache);

              if (!fs.existsSync(removeFilePath)) {
                delete cache[removeFilePath];
                return;
              }

              isRemoving = true;
              rimraf(removeFilePath, () => {
                isRemoving = false;

                delete cache[removeFilePath];
                debugLog(`Remove existing file: ${removeFilePath}`);
                debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);
              });
            }
          } else checkedTimes += 1;
        }
      }, 100);
    });
  });

  server.on('error', (err: mixed) => {
    debugLog(err);
  });

  server.listen(port, () => {
    debugLog(`Open server at ${port}`);
  });
};
