// @flow

import fs from 'fs';
import net from 'net';
import path from 'path';

import rimraf from 'rimraf';
import isRunning from 'is-running';
import findProcess from 'find-process';

import sendToServer from './sendToServer';
import findMainServer from './findMainServer';

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
export default async (
  port: number,
  debugLog: (message: mixed) => Promise<void>,
) => {
  const cache = {};
  let timer: IntervalID;
  let checkedTimes: number;

  const server = net.createServer((socket: net.Socket) => {
    socket.setEncoding('utf8');
    socket.on('data', async (data: string) => {
      debugLog(data);

      try {
        const mainServer = await findMainServer();
        const { pid, filePath } = JSON.parse(data);

        if (!pid || !filePath) return;

        if (!mainServer?.isMain) {
          sendToServer.end(JSON.stringify({ pid, filePath }), () => {
            debugLog(`${filePath} has been sent to the main server`);
          });
          return;
        }

        if (!cache[filePath]) cache[filePath] = [];

        cache[filePath].push(pid);
        debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);
        clearInterval(timer);

        let isRemoving: boolean = false;

        checkedTimes = 1;
        timer = setInterval(async () => {
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
            const currentMainServer = await findMainServer();
            const allProcess = !currentMainServer?.isMain
              ? []
              : (await findProcess(
                  'name',
                  path.resolve(__dirname, '../bin/runServer.js'),
                )).slice(1);

            debugLog(allProcess);

            if (
              checkedTimes >= TIME_TO_REMOVE_FILES / TIME_TO_CHECK &&
              Object.keys(cache).length !== 0
            ) {
              if (!isRemoving) {
                const [removeFilePath] = Object.keys(cache);

                /**
                 * @example
                 * removeCache();
                 */
                const removeCache = () => {
                  delete cache[removeFilePath];
                  debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);

                  if (Object.keys(cache).length === 0) checkedTimes = 0;
                };

                if (!fs.existsSync(removeFilePath)) {
                  debugLog(`File does not exist: ${removeFilePath}`);
                  removeCache();
                  return;
                }

                if (!currentMainServer?.isMain) return;

                // TODO: https://github.com/eslint/eslint/issues/11899
                // eslint-disable-next-line require-atomic-updates
                isRemoving = true;
                rimraf(removeFilePath, () => {
                  isRemoving = false;
                  debugLog(`Remove existing file: ${removeFilePath}`);
                  removeCache();
                });
              }
            } else if (
              allProcess.length === 0 &&
              checkedTimes >= TIME_TO_REMOVE_FILES / TIME_TO_CHECK
            )
              server.close(() => {
                clearInterval(timer);
                debugLog('Close server');
              });
            else checkedTimes += 1;
          }
        }, TIME_TO_CHECK);
      } catch (err) {
        debugLog(err);
      }
    });
  });

  server.on('error', (err: Error) => {
    debugLog(err.message);
  });

  server.listen(port, async () => {
    const mainServer = await findMainServer();

    if (!mainServer?.isMain)
      Object.keys(cache).forEach((filePath: string) => {
        cache[filePath].forEach((pid: string) => {
          sendToServer.end(JSON.stringify({ pid, filePath }), () => {
            debugLog(`${filePath} has been sent to the main server`);
          });
        });
      });

    debugLog(`(${process.pid}) Open server at ${port}`);
  });
};
