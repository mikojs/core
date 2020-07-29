// @flow

import path from 'path';
import EventEmitter from 'events';

import outputFileSync from 'output-file-sync';
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
 * @param {string} cachePath - cache path
 * @param {optionsType} options - build read files options
 */
export default <+C>(
  events: EventEmitter,
  cachePath: string,
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
      setCache: (cache: C) => {
        outputFileSync(cachePath, JSON.stringify(cache));
        events.emit('update-cache');
      },
    });
  });

  if (!watch)
    watcher.on('ready', async () => {
      await watcher.close();
      events.emit('close');
    });
};
