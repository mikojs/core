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
  init: (options: optionsType) => Koa,
  on: $PropertyType<buildCacheReturnType, 'add'>,
  run: (app: Koa) => Promise<http$Server>,
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
  const options: $NonMaybeType<optionsType> = { dev: true, port: 8000 };

  return {
    init: (initOptions?: optionsType): Koa => {
      logger.start('Server start');
      Object.keys(initOptions || {}).forEach((key: string) => {
        options[key] = initOptions?.[key];
      });

      return new Koa();
    },

    on: cache.add,

    run: async (app: Koa): Promise<http$Server> => {
      const { dev = true, port = 8000, dir } = options;
      const server = await new Promise(resolve => {
        const runningServer = app.listen(port, () => {
          resolve(runningServer);
        });
      });

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

      return server;
    },
  };
};
