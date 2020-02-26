// @flow

import Koa from 'koa';
import ora from 'ora';
import chalk from 'chalk';
import { emptyFunction } from 'fbjs';

import { createLogger, mockChoice } from '@mikojs/utils';

import buildCache, {
  type optionsType,
  type returnType as buildCacheReturnType,
} from './buildCache';
import buildWatchFiles, {
  type returnType as buildWatchFilesReturnType,
} from './buildWatchFiles';

type returnType = {|
  init: (options: optionsType) => Koa,
  on: $PropertyType<buildCacheReturnType, 'on'>,
  watchFiles: $PropertyType<buildWatchFilesReturnType, 'init'>,
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
  const watchFiles = buildWatchFiles();
  const options: $NonMaybeType<optionsType> = {
    dev: process.env.NODE_ENV !== 'production',
    build: Boolean(process.env.BUILD),
    port: parseInt(process.env.PORT || '8000', 10),
  };

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
        cache.on('build', () =>
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

    on: cache.on,
    watchFiles: watchFiles.init,

    run: async (app: Koa): Promise<http$Server> => {
      const { dev, port } = options;

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
        cache.on('watch', watchFiles.run);
        cache.run('watch', options);
      }

      return server;
    },
  };
};
