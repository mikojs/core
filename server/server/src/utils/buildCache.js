// @flow

import path from 'path';

import { d3DirTree } from '@mikojs/utils';
import {
  type d3DirTreeOptionsType,
  type d3DirTreeNodeType,
} from '@mikojs/utils/lib/d3DirTree';

type optionsType = {|
  ...$Diff<d3DirTreeOptionsType, {| normalizePath: mixed |}>,
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
  filePath: $PropertyType<$PropertyType<d3DirTreeNodeType, 'data'>, 'path'>,
  name: $PropertyType<$PropertyType<d3DirTreeNodeType, 'data'>, 'name'>,
  extension: $PropertyType<
    $PropertyType<d3DirTreeNodeType, 'data'>,
    'extension',
  >,
|};

/**
 * @example
 * buildCache({ folderPath: '/', callback: () => {} })
 *
 * @param {string} folderPath - folder path
 * @param {optionsType} options - options
 * @param {Function} callback - callback function
 */
export default (
  folderPath: string,
  { extensions, exclude, dev }: optionsType,
  callback: (event: eventType, data: dataType) => void,
) => {
  d3DirTree(folderPath, {
    extensions,
    exclude,
  })
    .leaves()
    .forEach(
      ({ data: { path: filePath, name, extension } }: d3DirTreeNodeType) =>
        callback('init', {
          filePath,
          name,
          extension,
        }),
    );

  if (dev)
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
