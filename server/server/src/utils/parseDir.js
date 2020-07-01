// @flow

import EventEmitter from 'events';

import fs from 'fs';
import path from 'path';

import { invariant, emptyFunction } from 'fbjs';

import { d3DirTree, mockChoice } from '@mikojs/utils';
import {
  type d3DirTreeOptionsType,
  type d3DirTreeNodeType,
} from '@mikojs/utils/lib/d3DirTree';

import initializeData from './initializeData';

export type optionsType = {|
  ...d3DirTreeOptionsType,
  basename?: string,
|};

export type dirEventsType =
  | 'add'
  | 'addDir'
  | 'change'
  | 'unlink'
  | 'unlinkDir'
  | 'ready'
  | 'raw'
  | 'error';

export type dirDataType = {|
  filePath: $PropertyType<$PropertyType<d3DirTreeNodeType, 'data'>, 'path'>,
  name: $PropertyType<$PropertyType<d3DirTreeNodeType, 'data'>, 'name'>,
  extension: $PropertyType<
    $PropertyType<d3DirTreeNodeType, 'data'>,
    'extension',
  >,
  pathname: string,
|};

/**
 * @param {string} folderPath - folder path
 * @param {d3DirTreeOptionsType} options - d3 dir tree options
 * @param {EventEmitter} events - events
 * @param {boolean} watch - watch mode or not
 *
 * @return {EventEmitter} - events
 */
export default (
  folderPath: string,
  { basename, ...options }: optionsType,
  events: EventEmitter,
  watch: boolean,
) => {
  const { extensions, exclude } = options;

  invariant(
    fs.existsSync(folderPath),
    `Can not find the folder: ${path.relative(process.cwd(), folderPath)}`,
  );

  if (!watch)
    d3DirTree(folderPath, options)
      .leaves()
      .filter(({ data: { type } }: d3DirTreeNodeType) => type === 'file')
      .forEach(
        ({ data: { path: filePath, name, extension } }: d3DirTreeNodeType) =>
          events.emit(
            'ready',
            initializeData({
              folderPath,
              basename,
              filePath,
              name,
              extension,
            }),
          ),
      );
  else
    mockChoice(process.env.NODE_ENV !== 'test', require('chokidar'), {
      watch: emptyFunction.thatReturns(events),
    })
      .watch(folderPath, { ignored: exclude })
      .on('all', (event: dirEventsType, filePath: string) => {
        if (!extensions?.test(filePath)) return;

        delete require.cache[filePath];
        events.emit(
          event,
          initializeData({
            folderPath,
            basename,
            filePath,
            name: path.basename(filePath),
            extension: path.extname(filePath),
          }),
        );
      });
};
