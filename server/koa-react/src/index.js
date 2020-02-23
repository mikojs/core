// @flow

import path from 'path';

import { type Middleware as MiddlewareType } from 'koa';
import compose from 'koa-compose';
import { type WebpackOptions as WebpackOptionsType } from 'webpack';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import buildCache, { type cacheType } from './utils/buildCache';
import writeClient from './utils/writeClient';
import buildServer from './utils/buildServer';

export type webpackMiddlewarweOptionsType = {
  config: WebpackOptionsType,
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
  update: (filePath: ?string) => void,
  middleware: MiddlewareType,
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
export default async (
  folderPath: string,
  // $FlowFixMe FIXME https://github.com/facebook/flow/issues/2977
  options?: optionsType = {},
): Promise<returnType> => {
  const cache = buildCache(folderPath, options);
  const {
    // dev = process.env.NODE_ENV !== 'production',
    extensions = /\.js$/,
    exclude,
    // webpackMiddlewarweOptions: webpackMiddlewarweOptionsFunc = emptyFunction.thatReturnsArgument,
  } = options;

  d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .forEach(({ data: { path: filePath } }: d3DirTreeNodeType) => {
      cache.addPage(filePath);
    });

  // const clientPath = writeClient(cache, options);
  // const config = getConfig(folderPath, options, cache, clientPath)
  const server = buildServer(options, cache);

  return {
    // update
    update: (filePath: ?string) => {
      if (
        !filePath ||
        !extensions.test(filePath) ||
        exclude?.test(filePath) ||
        !new RegExp(path.resolve(folderPath)).test(filePath)
      )
        return;

      cache.addPage(filePath);
      writeClient(cache, options);
    },

    // middleware
    middleware: compose([server]),

    // server
    // $FlowFixMe TODO: can not extend koa context type
    server,
  };
};
