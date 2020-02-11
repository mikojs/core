// @flow

import path from 'path';

import { type Middleware as MiddlewareType } from 'koa';
import compose from 'koa-compose';
import { type WebpackOptions as WebpackOptionsType } from 'webpack';
import { emptyFunction } from 'fbjs';
import address from 'address';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import getCache, { type cacheType } from './utils/getCache';
import getConfig from './utils/getConfig';
import writeClient from './utils/writeClient';
import buildServer from './utils/buildServer';
import buildJs from './utils/buildJs';

export type webpackMiddlewarweOptionsType = {
  config: WebpackOptionsType,
  devMiddleware: {
    stats?: $PropertyType<
      $NonMaybeType<$PropertyType<WebpackOptionsType, 'devServer'>>,
      'stats',
    >,
  },
};

export type optionsType = {|
  dev?: boolean,
  basename?: string,
  extensions?: RegExp,
  exclude?: RegExp,
  webpackMiddlewarweOptions?: (
    options: webpackMiddlewarweOptionsType,
    dev: boolean,
  ) => webpackMiddlewarweOptionsType,
  handler?: (
    routesData: $PropertyType<cacheType, 'routesData'>,
  ) => $PropertyType<cacheType, 'routesData'>,
|};

export type returnType = {|
  update: (filePath: string) => void,
  middleware: MiddlewareType,
  client: MiddlewareType,
  server: MiddlewareType,
  buildJs: () => Promise<{ [string]: string }>,
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
export default async (
  folderPath: string,
  // $FlowFixMe FIXME https://github.com/facebook/flow/issues/2977
  options?: optionsType = {},
): Promise<returnType> => {
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

  const client = dev
    ? await require('koa-webpack')(webpackMiddlewarweOptions)
    : await require('./utils/buildProdClient').default(
        webpackMiddlewarweOptions,
      );
  const server = buildServer(options, cache);

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

    // middleware
    middleware: compose([client, server]),

    // client
    client,

    // server
    // $FlowFixMe TODO: can not extend koa context type
    server,

    // build js
    buildJs: () => buildJs(webpackMiddlewarweOptions),
  };
};
