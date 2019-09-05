// @flow

import debug from 'debug';
import webpack, {
  type WebpackError as webpackErrorType,
  type Stats as statsType,
} from 'webpack';

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
    webpack(config, (err: webpackErrorType, stats: statsType) => {
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
    });
  });
