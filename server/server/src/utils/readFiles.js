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

type returnType = () => Promise<void>;

const cache = [];

/**
 * @param {optionsType} options - read files options
 * @param {callbackType} callback - callback
 *
 * @return {returnType} - read file function
 */
export default (
  { folderPath, basename, ignored, extensions }: optionsType,
  callback: callbackType,
): returnType => {
  cache.push(
    () =>
      new Promise(resolve => {
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
              path
                .dirname(path.relative(folderPath, filePath))
                .replace(/^\./, ''),
              name
                .replace(extension, '')
                .replace(/^index$/, '')
                .replace(/\[([^[\]]*)\]/g, ':$1'),
            ]
              .filter(Boolean)
              .join('/')}`,
          });
        });

        if (process.env.NODE_ENV !== 'production') resolve();
        else
          watcher.on('ready', async () => {
            await watcher.close();
            resolve();
          });
      }),
  );

  return async () => {
    await Promise.all(cache.map((run: () => Promise<void>) => run()));
  };
};
