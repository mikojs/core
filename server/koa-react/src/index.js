// @flow

import path from 'path';

import { type Middleware as MiddlewareType } from 'koa';
import compose from 'koa-compose';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import buildCache, { type cacheType } from './utils/buildCache';
import writeClient from './utils/writeClient';
import buildCompiler, {
  type returnType as buildCompilerReturnType,
} from './utils/buildCompiler';
import buildMiddleware from './utils/buildMiddleware';

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
    dev = process.env.NODE_ENV !== 'production',
    extensions = /\.js$/,
    exclude,
  } = options;

  d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .forEach(({ data: { path: filePath } }: d3DirTreeNodeType) => {
      cache.addPage(filePath);
    });

  const compiler = buildCompiler(folderPath, options, cache);

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
    runWebpack: compiler.run,

    // middleware
    middleware: compose([
      ...(dev
        ? []
        : [
            require('koa-mount')(
              compiler.config.output?.publicPath,
              require('koa-static')(compiler.config.output?.path),
            ),
          ]),
      buildMiddleware(options, cache, compiler),
    ]),
  };
};
