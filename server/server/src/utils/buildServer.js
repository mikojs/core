// @flow

import Koa from 'koa';
import chokidar from 'chokidar';
import ora from 'ora';
import chalk from 'chalk';
import { emptyFunction } from 'fbjs';

import { createLogger, mockChoice } from '@mikojs/utils';

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
      mockChoice(
        process.env.NODE_ENV === 'test',
        emptyFunction,
        logger.start,
        'Server start',
      );
      Object.keys(initOptions || {}).forEach((key: string) => {
        options[key] = initOptions?.[key];
      });

      if (!options.dev && options.build) {
        cache.add('build', () =>
          mockChoice(
            process.env.NODE_ENV === 'test',
            emptyFunction,
            process.exit,
            0,
          ),
        );
        cache.run('build', options);
      }

      return new Koa();
    },

    on: cache.add,

    run: async (app: Koa): Promise<http$Server> => {
      const { dev, port, dir } = options;

      await cache.run('run', options);

      const server = await new Promise(resolve => {
        const runningServer = app.listen(port, () => {
          resolve(runningServer);
        });
      });

      mockChoice(
        process.env.NODE_ENV === 'test',
        emptyFunction,
        logger.succeed,
        chalk`Running server at port: {gray {bold ${port?.toString()}}}`,
      );

      if (dev) {
        cache.run('watch', options);

        if (dir)
          chokidar
            .watch(dir, {
              ignoreInitial: true,
            })
            .on('all', async (event: string, filePath: string) => {
              if (event === 'add')
                await cache.run('watch:add', {
                  ...options,
                  filePath,
                });
              else if (event === 'change')
                await cache.run('watch:change', {
                  ...options,
                  filePath,
                });
            });
      }

      return server;
    },
  };
};
