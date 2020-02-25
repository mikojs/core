// @flow

import { emptyFunction } from 'fbjs';
import address from 'address';
import webpack, {
  type WebpackOptions as WebpackOptionsType,
  type WebpackCompiler as WebpackCompilerType,
} from 'webpack';

import { type optionsType } from '../index';

import { type cacheType } from './buildCache';
import getConfig from './getConfig';
import writeClient from './writeClient';

export type returnType = {|
  config: WebpackOptionsType,
  devMiddleware?: {},
  hotClient?: {},
  compiler: ?WebpackCompilerType,
  run: () => Promise<void>,
|};

/**
 * @example
 * buildCompiler('/', options, cache)
 *
 * @param {string} folderPath - the folder path
 * @param {optionsType} options - koa react options
 * @param {cacheType} cache - cache data
 *
 * @return {returnType} - compiler object
 */
export default (
  folderPath: string,
  options: optionsType,
  cache: cacheType,
): returnType => {
  const {
    dev = process.env.NODE_ENV !== 'production',
    webpackMiddlewarweOptions: webpackMiddlewarweOptionsFunc = emptyFunction.thatReturnsArgument,
  } = options;
  const webpackMiddlewarweOptions = webpackMiddlewarweOptionsFunc(
    {
      config: getConfig(
        folderPath,
        options,
        cache,
        writeClient(options, cache),
      ),
      devMiddleware: {
        serverSideRender: true,
        stats: {
          maxModules: 0,
          colors: true,
        },
      },
      hotClient: {
        logLevel: 'warn',
        host: address.ip(),
      },
    },
    dev,
  );
  let compiler: WebpackCompilerType;

  return {
    ...webpackMiddlewarweOptions,
    compiler,
    run: () =>
      new Promise(resolve => {
        compiler = webpack(webpackMiddlewarweOptions.config);

        if (!dev) {
          compiler.run(() => resolve());
          return;
        }

        const { server } = require('webpack-hot-client')(
          compiler,
          webpackMiddlewarweOptions.hotClient,
        );

        server.on('listening', resolve);
      }),
  };
};
