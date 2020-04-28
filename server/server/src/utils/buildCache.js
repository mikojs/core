// @flow

import path from 'path';

import { d3DirTree } from '@mikojs/utils';
import { type d3DirTreeNodeType } from '@mikojs/utils/lib/d3DirTree';

type optionsType = {|
  extensions?: RegExp,
  exclude?: RegExp,
  dev?: boolean,
|};

type eventType =
  | 'init'
  | 'add'
  | 'addDir'
  | 'change'
  | 'unlink'
  | 'unlinkDir'
  | 'ready'
  | 'raw'
  | 'error';

type dataType = {|
  filePath: string,
  name: string,
  extension: mixed,
|};

type returnType<R> = {
  [string]: R,
};

/**
 * @example
 * buildCache({ folderPath: '/', callback: () => {} })
 *
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 * @param {Function} callback - callback function
 *
 * @return {returnType} - cache
 */
export default <R>(
  folderPath: string,
  { extensions, exclude, dev }: optionsType,
  callback: (event: eventType, data: dataType) => R,
): returnType<R> => {
  const cache = d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .reduce(
      (
        result: returnType<R>,
        { data: { path: filePath, name, extension } }: d3DirTreeNodeType,
      ) => ({
        ...result,
        [filePath]: callback('init', {
          filePath,
          name,
          extension,
        }),
      }),
      {},
    );

  if (dev)
    require('chokidar')
      .watch(folderPath)
      .on('all', (event: eventType, filePath: string) => {
        cache[filePath] = callback(event, {
          filePath,
          name: path.basename(filePath),
          extension: path.extname(filePath),
        });
      });

  return cache;
};
