// @flow

import webpack, { type WebpackOptions as WebpackOptionsType } from 'webpack';
import { emptyFunction } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

export type configType = {
  config: WebpackOptionsType,
  devMiddleware: {
    stats?: $PropertyType<
      $NonMaybeType<$PropertyType<WebpackOptionsType, 'devServer'>>,
      'stats',
    >,
  },
};

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
          toJson: () => {
            errors: $ReadOnlyArray<string>,
            assetsByChunkName: { [string]: string },
          },
        },
      ) => {
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

        mockChoice(
          process.env.NODE_ENV === 'test',
          emptyFunction,
          log,
          stats.toString(logStats),
        );
        resolve(stats.toJson().assetsByChunkName);
      },
    );
  });
