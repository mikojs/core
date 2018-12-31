// @flow

import debug from 'debug';

import base from 'stores/base';

import type StoreType, { ctxType } from 'stores';

export default async (ctx: ctxType): Promise<void> => {
  const storeNames = [];
  const stores = (await base.run(ctx)).filter(
    ({ constructor: { name } }: StoreType): boolean => {
      if (storeNames.includes(name)) return false;

      storeNames.push(name);
      return true;
    },
  );

  debug('create-project:runStores')(stores);
  for (const store of stores) await store.end(ctx);
  await base.end(ctx);
};
