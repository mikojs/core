// @flow

import fs from 'fs';
import path from 'path';

import { invariant } from 'fbjs';

import d3DirTree, {
  type d3DirTreeOptionsType,
  type d3DirTreeNodeType,
} from './d3DirTree';
import mockChoice from './mockChoice';

export type mergeDirOptionsType = {|
  ...d3DirTreeOptionsType,
  watch?: boolean,
|};

export type mergeDirEventType =
  | 'init'
  | 'add'
  | 'addDir'
  | 'change'
  | 'unlink'
  | 'unlinkDir'
  | 'ready'
  | 'raw'
  | 'error';

export type mergeDirDataType = {|
  filePath: $PropertyType<$PropertyType<d3DirTreeNodeType, 'data'>, 'path'>,
  name: $PropertyType<$PropertyType<d3DirTreeNodeType, 'data'>, 'name'>,
  extension: $PropertyType<
    $PropertyType<d3DirTreeNodeType, 'data'>,
    'extension',
  >,
|};

type callbackType = (event: mergeDirEventType, data: mergeDirDataType) => void;

export const mockUpdate = {
  cache: [],
  clear: () => {
    mockUpdate.cache = [];
  },
  watch: (folderPath: string, options: {| ignoreInitial: boolean |}) => ({
    on: (
      event: 'all',
      callback: (event: mergeDirEventType, filePath: string) => void,
    ) => {
      mockUpdate.cache.push(callback);
    },
  }),
};

/**
 * @example
 * mergeDir('/', options, callback)
 *
 * @param {string} folderPath - folder path
 * @param {mergeDirOptionsType} options - options
 * @param {callbackType} callback - callback function
 */
export default (
  folderPath: string,
  { watch, ...options }: mergeDirOptionsType,
  callback: callbackType,
) => {
  invariant(
    fs.existsSync(folderPath),
    `Can not find the folder: ${path.relative(process.cwd(), folderPath)}`,
  );
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
    mockChoice(process.env.NODE_ENV !== 'test', require('chokidar'), mockUpdate)
      .watch(folderPath, { ignoreInitial: true })
      .on('all', (event: mergeDirEventType, filePath: string) =>
        callback(event, {
          filePath,
          name: path.basename(filePath),
          extension: path.extname(filePath),
        }),
      );
};
