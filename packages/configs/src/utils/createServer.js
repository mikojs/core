// @flow

import fs from 'fs';
import net from 'net';
import path from 'path';

import rimraf from 'rimraf';
import isRunning from 'is-running';
import findProcess from 'find-process';

export const TIME_TO_CLOSE_SERVER = 5000;
export const TIME_TO_REMOVE_FILES = 500;
export const TIME_TO_CHECK = 100;

/**
 * @example
 * new createServer(8000, debugLog)
 *
 * @param {number} port - the port of the server
 * @param {Function} debugLog - debug log function
 */
export default (port: number, debugLog: (message: mixed) => Promise<void>) => {
  const cache = {};
  let timer: TimeoutID;

  const server = net.createServer((socket: net.Socket) => {
    socket.setEncoding('utf8');
    socket.on('data', async (data: string) => {
      debugLog(data);

      try {
        const { pid, filePath } = JSON.parse(data);

        if (!pid || !filePath) return;

        if (!cache[filePath]) cache[filePath] = [];

        cache[filePath].push(pid);
        debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);
        clearTimeout(timer);

        /**
         * @example
         * checking(0)
         *
         * @param {number} checkedTimes - checked times
         */
        const checking = async (checkedTimes: number) => {
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

          if (hasWorkingPids) {
            timer = setTimeout(checking, TIME_TO_CHECK, 0);
            return;
          }

          if (
            checkedTimes >= TIME_TO_REMOVE_FILES / TIME_TO_CHECK &&
            Object.keys(cache).length !== 0
          ) {
            const [removeFilePath] = Object.keys(cache);

            /**
             * @example
             * nextEvent()
             */
            const nextEvent = () => {
              delete cache[removeFilePath];
              debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);

              timer = setTimeout(
                checking,
                TIME_TO_CHECK,
                Object.keys(cache).length === 0 ? 0 : checkedTimes,
              );
            };

            if (!fs.existsSync(removeFilePath)) {
              debugLog(`File does not exist: ${removeFilePath}`);
              nextEvent();
              return;
            }

            rimraf(removeFilePath, () => {
              debugLog(`Remove existing file: ${removeFilePath}`);
              nextEvent();
            });
            return;
          }

          if (checkedTimes >= TIME_TO_CLOSE_SERVER / TIME_TO_CHECK) {
            const allProcess = (await findProcess(
              'name',
              path.resolve(__dirname, '../bin/runServer.js'),
            )).slice(1);

            if (allProcess.length === 0) {
              clearTimeout(timer);
              server.close(() => {
                debugLog('Close server');
              });
              return;
            }

            debugLog(allProcess);
            timer = setTimeout(checking, TIME_TO_CHECK, checkedTimes);
            return;
          }

          timer = setTimeout(checking, TIME_TO_CHECK, checkedTimes + 1);
        };

        checking(0);
      } catch (err) {
        debugLog(err);
      }
    });
  });

  server.on('error', (err: Error) => {
    debugLog(err.message);
  });

  server.listen(port, () => {
    debugLog(`(${process.pid}) Open server at ${port}`);
  });
};
