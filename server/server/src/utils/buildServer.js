// @flow

import Koa from 'koa';
import chokidar from 'chokidar';
import ora from 'ora';
import chalk from 'chalk';

import { createLogger } from '@mikojs/utils';

import buildCache, {
  type optionsType,
  type returnType as buildCacheReturnType,
} from './buildCache';

type returnType = {|
  init: () => Koa,
  on: $PropertyType<buildCacheReturnType, 'add'>,
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
  const cache = buildCache();

  return {
    init: (): Koa => {
      logger.start('Server start');

      return new Koa();
    },

    on: cache.add,

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
                cache.run(`watch:${event}`, {
                  ...options,
                  filePath,
                });
              });

          resolve(server);
        });
      }),
  };
};
