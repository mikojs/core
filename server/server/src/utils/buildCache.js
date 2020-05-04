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
  useMiddleware?: boolean,
  dev?: boolean,
  port?: number,
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

type updateCacheType = (event: eventType, data: dataType) => void;

export type middlewareType = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
) => void;

/**
 * @example
 * buildCache({ folderPath: '/', updateCache: () => {} })
 *
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 * @param {Function} updateCache - update cache function
 * @param {middlewareType} middleware - middleware function
 *
 * @return {middlewareType} - middleware
 */
export default (
  folderPath: string,
  { extensions, exclude, useMiddleware, dev, port }: optionsType,
  updateCache: updateCacheType,
  middleware: middlewareType,
): middlewareType => {
  d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .forEach(
      ({ data: { path: filePath, name, extension } }: d3DirTreeNodeType) =>
        updateCache('init', {
          filePath,
          name,
          extension,
        }),
    );

  if (dev)
    require('chokidar')
      .watch(folderPath)
      .on('all', (event: eventType, filePath: string) =>
        updateCache(event, {
          filePath,
          name: path.basename(filePath),
          extension: path.extname(filePath),
        }),
      );

  if (useMiddleware) return middleware;

  http.createServer(middleware).listen(port || 8000);

  return () => {
    throw new Error(
      'If you want to use middleware, use should use `useMiddleware` option.',
    );
  };
};
