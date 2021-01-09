// @flow

import findCacheDir from 'find-cache-dir';

export default (findCacheDir({ name: '@mikojs/flow-typed', thunk: true }): (
  name: string,
) => string);
