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

type dirEventsType =
  | 'init'
  | 'add'
  | 'addDir'
  | 'change'
  | 'unlink'
  | 'unlinkDir'
  | 'ready'
  | 'raw'
  | 'error';

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
  options: d3DirTreeOptionsType,
  events: EventEmitter,
  watch: boolean,
) => {
  const { extensions, exclude } = options;

  invariant(
    fs.existsSync(folderPath),
    `Can not find the folder: ${path.relative(process.cwd(), folderPath)}`,
  );
  d3DirTree(folderPath, options)
    .leaves()
    .filter(({ data: { type } }: d3DirTreeNodeType) => type === 'file')
    .forEach(
      ({ data: { path: filePath, name, extension } }: d3DirTreeNodeType) =>
        events.emit('init', {
          filePath,
          name,
          extension,
        }),
    );

  if (watch)
    mockChoice(process.env.NODE_ENV !== 'test', require('chokidar'), {
      watch: emptyFunction.thatReturns(events),
    })
      .watch(folderPath, { ignored: exclude, ignoreInitial: true })
      .on('all', (event: dirEventsType, filePath: string) => {
        if (!extensions?.test(filePath)) return;

        delete require.cache[filePath];
        events.emit(event, {
          filePath,
          name: path.basename(filePath),
          extension: path.extname(filePath),
        });
      });
};
