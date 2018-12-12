// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';
import outputFileSync from 'output-file-sync';
import debug from 'debug';

export type ctxType = {
  appDir: string,
};

const debugLog = debug('create-app:store');

/** default store */
export default class Store {
  ctx: ctxType;

  subStores = [];

  start = emptyFunction;

  end = emptyFunction;

  /**
   * not overwrite
   *
   * @example
   * store.run(ctx)
   *
   * @param {Object} ctx - store context
   */
  run = async (ctx: ctxType): Promise<$ReadOnlyArray<Store>> => {
    const stores = [];

    this.ctx = ctx;
    await this.start(ctx);

    for (const store of this.subStores) stores.concat(await store.run(ctx));

    return [...this.subStores, ...stores];
  };

  /**
   * @example
   * store.writeFiles({ 'path': 'test' })
   *
   * @param {Object} files - files object
   */
  writeFiles = (files: { [string]: string }) => {
    const { appDir } = this.ctx;

    Object.keys(files).forEach((key: string) => {
      const writeFile = [path.resolve(appDir, key), files[key]];

      outputFileSync(...writeFile);
      debugLog(writeFile);
    });
  };
}
