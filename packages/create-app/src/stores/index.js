// @flow

import { emptyFunction } from 'fbjs';

export type ctxType = {
  projectDir: string,
};

/** default store */
export default class Store {
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

    await this.start(ctx);

    for (const store of this.subStores) stores.concat(await store.run(ctx));

    return [...this.subStores, ...stores];
  };
}
