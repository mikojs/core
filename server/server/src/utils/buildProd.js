// @flow

import readFiles, { type optionsType, type callbackType } from './readFiles';

export type returnType = (options: optionsType) => Promise<void>;

const callbacks = [];

/**
 * @param {callbackType} prod - originial prod function
 * @param {optionsType} options - read files options
 *
 * @return {returnType} - prod function
 */
export default (prod: callbackType, options: optionsType): returnType => {
  callbacks.push(
    () =>
      new Promise(resolve => {
        const watcher = readFiles(options, prod);

        watcher.on('ready', async () => {
          await watcher.close();
          resolve();
        });
      }),
  );

  return async () => {
    await Promise.all(
      callbacks.map((callback: () => Promise<void>) => callback()),
    );
  };
};
