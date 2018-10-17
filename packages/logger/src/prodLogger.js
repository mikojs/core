// @flow

import { emptyFunction } from 'fbjs';

import type { emptyFunction as emptyFunctionType } from 'fbjs';

type prodLoggerType = {
  [string]: emptyFunctionType,
};

export default (logNames?: $ReadOnlyArray<string> = []) =>
  [
    'log',
    'succeed',
    'fail',
    'warn',
    'info',
    'init',
    'start',
    ...logNames,
  ].reduce(
    (result: prodLoggerType, key: string) => ({
      ...result,
      [key]: emptyFunction,
    }),
    ({}: prodLoggerType),
  );
