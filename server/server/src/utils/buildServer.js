// @flow

import Koa from 'koa';
import chokidar from 'chokidar';
import ora from 'ora';
import chalk from 'chalk';

import { createLogger } from '@mikojs/utils';

type eventsType = $ReadOnlyArray<string> | string;
type callbackType = (filePath: string) => void;

type optionsType = {|
  dev?: boolean,
  port?: number,
|};

type returnType = {|
  init: () => Koa,
  on: (events: eventsType, callback: callbackType) => void,
  run: (
    folderPath: string,
    options?: optionsType,
  ) => (app: Koa) => Promise<http$Server>,
|};

const logger = createLogger('@mikojs/server', ora({ discardStdin: false }));

/**
 * @example
 * buildServer()
 *
 * @return {returnType} - server object
 */
export default (): returnType => {
  const callbackCache = [
    {
      events: ['add', 'change'],
      callback: (filePath: string) => {
        if (!/\.js$/.test(filePath)) return;

        delete require.cache[filePath];
      },
    },
  ];

  return {
    init: (): Koa => {
      logger.start('Server start');

      return new Koa();
    },

    on: (events: eventsType, callback: callbackType) => {
      callbackCache.push({
        events,
        callback,
      });
    },

    run: (folderPath: string, options?: optionsType) => (
      app: Koa,
    ): Promise<http$Server> =>
      new Promise(resolve => {
        const { dev = true, port = 8000 } = options || {};
        const server = app.listen(port, () => {
          logger.succeed(
            chalk`Running server at port: {gray {bold ${port.toString()}}}`,
          );

          if (dev)
            chokidar
              .watch(folderPath, {
                ignoreInitial: true,
              })
              .on('all', (event: string, filePath: string) => {
                callbackCache.forEach(
                  ({
                    events,
                    callback,
                  }: {|
                    events: eventsType,
                    callback: callbackType,
                  |}) => {
                    if (events !== event && !events.includes(event)) return;

                    callback(filePath);
                  },
                );
              });

          resolve(server);
        });
      }),
  };
};
