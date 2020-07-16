// @flow

import path from 'path';

import chokidar from 'chokidar';

export type optionsType = {|
  folderPath: string,
  basename?: string,
  ignored?: RegExp,
  extensions?: RegExp,
|};

export type eventsType =
  | 'add'
  | 'addDir'
  | 'change'
  | 'unlink'
  | 'unlinkDir'
  | 'ready'
  | 'raw'
  | 'error';

export type callbackType = (
  event: eventsType,
  data: {|
    name: string,
    extension: string,
    filePath: string,
    pathname: string,
  |},
) => void;

/**
 * @param {optionsType} options - read files options
 * @param {callbackType} callback - callback
 *
 * @return {chokidar} - chokidar watcher
 */
export default (
  { folderPath, basename, ignored, extensions }: optionsType,
  callback: callbackType,
): typeof chokidar => {
  const watcher = chokidar.watch(folderPath, {
    ignored,
  });

  watcher.on('all', (event: eventsType, filePath: string) => {
    if (!extensions?.test(filePath)) return;

    const name = path.basename(filePath);
    const extension = path.extname(filePath);

    delete require.cache[filePath];
    callback(event, {
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

  return watcher;
};
