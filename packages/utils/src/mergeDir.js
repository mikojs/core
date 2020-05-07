// @flow

import path from 'path';

import d3DirTree, {
  type d3DirTreeOptionsType,
  type d3DirTreeNodeType,
} from './d3DirTree';

export type optionsType = {|
  ...d3DirTreeOptionsType,
  watch: boolean,
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

type callbackType = (event: eventType, data: dataType) => void;

/**
 * @example
 * mergeDir('/', options, callback)
 *
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 * @param {callbackType} callback - callback function
 */
export default (
  folderPath: string,
  { watch, ...options }: optionsType = {},
  callback: callbackType,
) => {
  d3DirTree(folderPath, options)
    .leaves()
    .filter(({ data: { type } }: d3DirTreeNodeType) => type === 'file')
    .forEach(
      ({ data: { path: filePath, name, extension } }: d3DirTreeNodeType) =>
        callback('init', {
          filePath,
          name,
          extension,
        }),
    );

  if (watch)
    require('chokidar')
      .watch(folderPath)
      .on('all', (event: eventType, filePath: string) =>
        callback(event, {
          filePath,
          name: path.basename(filePath),
          extension: path.extname(filePath),
        }),
      );
};
