// @flow

export type ctxType<T> = {
  isServer: boolean,
  ctx: T,
};
