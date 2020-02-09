// @flow

import path from 'path';

import { type Middleware as MiddlewareType } from 'koa';

import { d3DirTree, requireModule } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

import getCache, { type cacheType } from './utils/getCache';
import writeClient from './utils/writeClient';
import buildServer from './utils/buildServer';

export type optionsType = {|
  basename?: string,
  extensions?: RegExp,
  exclude?: RegExp,
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
  const { extensions = /\.js$/, exclude } = options;

  d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .forEach(({ data: { path: filePath } }: d3DirTreeNodeType) => {
      cache.addPage(filePath);
    });

  const clientPath = writeClient(cache, options);

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
    client: () => requireModule(clientPath),

    // server
    server: buildServer(options, cache, {
      clientUrl: 'TODO: clientUrl',
      commonsUrl: 'TOOD: commonsUrl',
    }),
  };
};
