// @flow

import path from 'path';

import { type Middleware as MiddlewareType } from 'koa';
import { type WebpackOptions as WebpackOptionsType } from 'webpack';
import { emptyFunction, invariant } from 'fbjs';
import address from 'address';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import getCache, { type cacheType } from './utils/getCache';
import getConfig from './utils/getConfig';
import writeClient from './utils/writeClient';
import buildServer from './utils/buildServer';

type configType = {
  config: WebpackOptionsType,
};

export type optionsType = {|
  dev?: boolean,
  basename?: string,
  extensions?: RegExp,
  exclude?: RegExp,
  webpackMiddlewarweOptions?: (config: configType, dev: boolean) => configType,
  handler?: (
    routesData: $PropertyType<cacheType, 'routesData'>,
  ) => $PropertyType<cacheType, 'routesData'>,
|};

type returnType = {|
  update: (filePath: string) => void,
  client: () => void,
  server: MiddlewareType,
|};

/**
 * @example
 * react('/')
 *
 * @param {string} folderPath - the folder path
 * @param {optionsType} options - koa react options
 *
 * @return {returnType} - koa react functions
 */
export default (
  folderPath: string,
  // $FlowFixMe FIXME https://github.com/facebook/flow/issues/2977
  options?: optionsType = {},
): returnType => {
  const cache = getCache(folderPath, options);
  const {
    dev = process.env.NODE_ENV !== 'production',
    extensions = /\.js$/,
    exclude,
    webpackMiddlewarweOptions: webpackMiddlewarweOptionsFunc = emptyFunction.thatReturnsArgument,
  } = options;

  d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .forEach(({ data: { path: filePath } }: d3DirTreeNodeType) => {
      cache.addPage(filePath);
    });

  const clientPath = writeClient(cache, options);
  const webpackMiddlewarweOptions = webpackMiddlewarweOptionsFunc(
    {
      config: getConfig(folderPath, options, cache, clientPath),
      devMiddleware: {
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

  invariant(
    webpackMiddlewarweOptions.config.output?.publicPath &&
    webpackMiddlewarweOptions.config.output?.path,
    'Both of `publicPath`, `path` in `webpackMiddlewarweOptions.config.output` are required',
  );

  return {
    // update
    update: (filePath: string) => {
      if (
        !extensions.test(filePath) ||
        exclude?.test(filePath) ||
        !new RegExp(path.resolve(folderPath)).test(filePath)
      )
        return;

      cache.addPage(filePath);
      writeClient(cache, options);
    },

    // client
    client: () =>
      dev
        ? require('koa-webpack')(webpackMiddlewarweOptions)
        : require('koa-mount')(
            // FIXME: invariant should check type
            webpackMiddlewarweOptions.config.output?.publicPath,
            require('koa-static')(
              webpackMiddlewarweOptions.config.output?.path,
            ),
          ),

    // server
    server: buildServer(options, cache, {
      clientUrl: 'TODO: clientUrl',
      commonsUrl: 'TOOD: commonsUrl',
    }),
  };
};
