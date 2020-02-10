// @flow

import webpack, {
  type WebpackError as webpackErrorType,
  type Stats as statsType,
} from 'webpack';
import debug from 'debug';

import { type webpackMiddlewarweOptionsType } from '../index';

const debugLog = debug('react:build-js');

/**
 * @example
 * buildJs(options)
 *
 * @param {webpackMiddlewarweOptionsType} options - webpack middleware options
 *
 * @return {Promise} - chunk names
 */
export default ({
  config,
  devMiddleware: { stats: logStats },
}: webpackMiddlewarweOptionsType) =>
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

      log(stats.toString({ logStats, colors: true }));
      resolve(stats.toJson().assetsByChunkName);
    });
  });
