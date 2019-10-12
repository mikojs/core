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
  let timer: TimeoutID;

  const server = net.createServer((socket: net.Socket) => {
    socket.setEncoding('utf8');
    socket.on('data', async (data: string) => {
      debugLog(data);

      try {
        const mainServer = await findMainServer();
        const { pid, filePath } = JSON.parse(data);

        if (!pid || !filePath) return;

        if (!mainServer?.isMain) {
          sendToServer(JSON.stringify({ pid, filePath }), () => {
            debugLog(`${filePath} has been sent to the main server`);
          });
          return;
        }

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
             * nextEvent(true);
             *
             * @param {boolean} shouldRemoveFile - should remove file or not
             */
            const nextEvent = (shouldRemoveFile: boolean) => {
              if (shouldRemoveFile) {
                delete cache[removeFilePath];
                debugLog(`Cache: ${JSON.stringify(cache, null, 2)}`);
              }

              timer = setTimeout(
                checking,
                TIME_TO_CHECK,
                Object.keys(cache).length === 0 ? 0 : checkedTimes,
              );
            };

            if (!fs.existsSync(removeFilePath)) {
              debugLog(`File does not exist: ${removeFilePath}`);
              nextEvent(true);
              return;
            }

            const currentMainServer = await findMainServer();

            if (!currentMainServer?.isMain) {
              nextEvent(false);
              return;
            }

            rimraf(removeFilePath, () => {
              debugLog(`Remove existing file: ${removeFilePath}`);
              nextEvent(true);
            });
            return;
          }

          if (checkedTimes >= TIME_TO_CLOSE_SERVER / TIME_TO_CHECK) {
            const currentMainServer = await findMainServer();
            const allProcess = !currentMainServer?.isMain
              ? []
              : (await findProcess(
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

  server.listen(port, async () => {
    const mainServer = await findMainServer();

    if (!mainServer?.isMain)
      Object.keys(cache).forEach((filePath: string) => {
        cache[filePath].forEach((pid: string) => {
          sendToServer(JSON.stringify({ pid, filePath }), () => {
            debugLog(`${filePath} has been sent to the main server`);
          });
        });
      });

    debugLog(`(${process.pid}) Open server at ${port}`);
  });
};
