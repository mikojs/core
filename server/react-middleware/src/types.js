// @flow

import { type Context as koaContextType } from 'koa';

export type clientCtxType = {
  isServer: false,
  ctx: {},
};

export type serverCtxType = {
  isServer: true,
  ctx: koaContextType,
};
