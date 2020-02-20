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
  dir?: string,
|};

type returnType = {|
  init: () => Koa,
  on: (events: eventsType, callback: callbackType) => void,
  run: (options?: optionsType) => (app: Koa) => Promise<http$Server>,
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

    run: (options?: optionsType) => (app: Koa): Promise<http$Server> =>
      new Promise(resolve => {
        const { dev = true, port = 8000, dir } = options || {};
        const server = app.listen(port, () => {
          logger.succeed(
            chalk`Running server at port: {gray {bold ${port.toString()}}}`,
          );

          if (dev && dir)
            chokidar
              .watch(dir, {
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
