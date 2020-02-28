// @flow

import path from 'path';

import { type Middleware as MiddlewareType } from 'koa';
import compose from 'koa-compose';
import { emptyFunction } from 'fbjs';

import { d3DirTree, mockChoice } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import buildCache, { type cacheType } from './utils/buildCache';
import writeClient from './utils/writeClient';
import buildCompiler, {
  type returnType as buildCompilerReturnType,
} from './utils/buildCompiler';
import buildClient from './utils/buildClient';
import buildServer from './utils/buildServer';

export type webpackMiddlewarweOptionsType = $Diff<
  buildCompilerReturnType,
  {| compiler: mixed, run: mixed |},
>;

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
  runWebpack: () => Promise<void>,
  middleware: MiddlewareType,
  client: MiddlewareType,
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
  const cache = buildCache(folderPath, options);
  const { extensions = /\.js$/, exclude } = options;

  d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .forEach(({ data: { path: filePath } }: d3DirTreeNodeType) => {
      cache.addPage(filePath);
    });

  const compiler = buildCompiler(folderPath, options, cache);
  const client = buildClient(options, compiler);
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
      writeClient(options, cache);
    },

    // run webpack or watching
    runWebpack: () =>
      mockChoice(process.env.NODE_ENV === 'test', emptyFunction, compiler.run),

    // middleware
    middleware: compose([client, server]),

    // client
    client,

    // server
    // $FlowFixMe TODO: can not extend koa context type
    server,
  };
};
