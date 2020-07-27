// @flow

import path from 'path';
import EventEmitter from 'events';

import chokidar from 'chokidar';

import { type eventsType } from './buildEvents';

export type optionsType = {|
  folderPath: string,
  watch: boolean,
  basename?: string,
  ignored?: RegExp,
  extensions?: RegExp,
|};

/**
 * @param {EventEmitter} events - events
 * @param {optionsType} options - build read files options
 */
export default (
  events: EventEmitter,
  { folderPath, watch, basename, ignored, extensions }: optionsType,
) => {
  const watcher = chokidar.watch(folderPath, {
    ignored,
  });

  watcher.on('all', (event: eventsType, filePath: string) => {
    if (!extensions?.test(filePath)) return;

    const name = path.basename(filePath);
    const extension = path.extname(filePath);

    delete require.cache[filePath];
    events.emit(event, {
      name,
      extension,
      filePath,
      pathname: `/${[
        basename,
        path.dirname(path.relative(folderPath, filePath)).replace(/^\./, ''),
        name
          .replace(extension, '')
          .replace(/^index$/, '')
          .replace(/\[([^[\]]*)\]/g, ':$1'),
      ]
        .filter(Boolean)
        .join('/')}`,
    });
  });

  if (!watch)
    watcher.on('ready', async () => {
      await watcher.close();
      events.emit('close');
    });
};
