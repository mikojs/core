// @flow

import { emptyFunction } from 'fbjs';

export default (logNames: $ReadOnlyArray<string>) =>
  logNames.reduce(
    (result: {}, key: string): {} => ({
      ...result,
      [key]: emptyFunction,
    }),
    {},
  );
