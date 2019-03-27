// @flow

export default () => async (ctx: {||}, next: () => Promise<void>) => {
  await next();
};
