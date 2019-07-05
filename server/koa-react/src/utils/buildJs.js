// @flow

import debug from 'debug';
import webpack from 'webpack';

import { type configType } from '../index';

const debugLog = debug('react:buildJs');

/**
 * @example
 * buildJs(config)
 *
 * @param {configType} config - koa webpack config
 *
 * @return {{ string: string }} - js filenames which are build from webpack
 */
export default ({ config, devMiddleware: { stats: logStats } }: configType) =>
  new Promise<{
    [string]: string,
  }>((resolve, reject) => {
    webpack(
      config,
      // $FlowFixMe: after flow-typed add webpack type
      (
        err: Error & {
          details?: string,
        },
        stats: {
          hasErrors: () => boolean,
          toString: (
            stats: $PropertyType<
              $PropertyType<configType, 'devMiddleware'>,
              'stats',
            >,
          ) => string,
          toJson: () => {|
            errors: $ReadOnlyArray<string>,
            assetsByChunkName: {| [string]: string |},
          |},
        },
      ) => {
        debugLog(err);

        if (err) {
          if (err.details) reject(err.details);
          else reject(err);

          return;
        }

        if (stats.hasErrors()) {
          reject(stats.toJson().errors);
          return;
        }

        const { log } = console;

        log(stats.toString(logStats));
        resolve(stats.toJson().assetsByChunkName);
      },
    );
  });
