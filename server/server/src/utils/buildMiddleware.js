// @flow

import path from 'path';
import http from 'http';

import { d3DirTree } from '@mikojs/utils';
import {
  type d3DirTreeOptionsType,
  type d3DirTreeNodeType,
} from '@mikojs/utils/lib/d3DirTree';

export type optionsType = {|
  ...$Diff<d3DirTreeOptionsType, {| normalizePath: mixed |}>,
  dev?: boolean,
|};

export type eventType =
  | 'init'
  | 'add'
  | 'addDir'
  | 'change'
  | 'unlink'
  | 'unlinkDir'
  | 'ready'
  | 'raw'
  | 'error';

export type dataType = {|
  filePath: $PropertyType<$PropertyType<d3DirTreeNodeType, 'data'>, 'path'>,
  name: $PropertyType<$PropertyType<d3DirTreeNodeType, 'data'>, 'name'>,
  extension: $PropertyType<
    $PropertyType<d3DirTreeNodeType, 'data'>,
    'extension',
  >,
|};

type updateCacheType<C> = (event: eventType, cache: C, data: dataType) => void;

export type middlewareType = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void;

type getMiddlewareType<C> = (cache: C) => middlewareType;

/**
 * @example
 * buildMiddleware('/', options, cache, () => {}, () => {})
 *
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 * @param {any} cache - cache
 * @param {Function} updateCache - update cache function
 * @param {Function} getMiddleware - get middleware function
 *
 * @return {middlewareType} - middleware
 */
export default <C>(
  folderPath: string,
  { extensions, exclude, dev }: optionsType = {},
  cache: C,
  updateCache: updateCacheType<C>,
  getMiddleware: getMiddlewareType<C>,
): middlewareType => {
  d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .forEach(
      ({ data: { path: filePath, name, extension } }: d3DirTreeNodeType) =>
        updateCache('init', cache, {
          filePath,
          name,
          extension,
        }),
    );

  if (dev)
    require('chokidar')
      .watch(folderPath)
      .on('all', (event: eventType, filePath: string) =>
        updateCache(event, cache, {
          filePath,
          name: path.basename(filePath),
          extension: path.extname(filePath),
        }),
      );

  return getMiddleware(cache);
};
