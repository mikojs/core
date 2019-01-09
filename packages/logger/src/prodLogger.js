// @flow

import { type logsType } from './index';

export default (logNames?: $ReadOnlyArray<string> = []): logsType => {
  const logs = [
    'log',
    'succeed',
    'fail',
    'warn',
    'info',
    'init',
    'start',
    ...logNames,
  ].reduce(
    (result: logsType, key: string) => ({
      ...result,
      [key]: () => logs,
    }),
    ({}: logsType),
  );

  return logs;
};
