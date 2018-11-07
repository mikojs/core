// @flow

import { emptyFunction } from 'fbjs';

import chalk from './chalkPolyfill';

import defaultLogSettings from './settings/log';

type messageType = string | {};
type logType = (...messages: $ReadOnlyArray<messageType>) => logsType;

export type logsType = {
  [string]: logType,
};

export type settingsType = {
  init?: (...args: $ReadOnlyArray<mixed>) => void,
  [string]: {
    getName?: (name: string) => string,
    print: (message: string) => void,
    after?: (name: string) => mixed,
  },
};

const GET_NAME = {
  log: (name: string) => chalk`{gray   {bold ${name}}}`,
  succeed: (name: string) => chalk`{green ✔ {bold ${name}}}`,
  fail: (name: string) => chalk`{red ✖ {bold ${name}}}`,
  warn: (name: string) => chalk`{yellow ⚠ {bold ${name}}}`,
  info: (name: string) => chalk`{blue ℹ {bold ${name}}}`,
};

export default (
  name: string,
  { init, ...logSettings }: settingsType = defaultLogSettings,
):
  | {
      init: (...args: $ReadOnlyArray<mixed>) => logsType,
      log: (...messages: $ReadOnlyArray<messageType>) => logsType,
    }
  | logsType => {
  const logs = Object.keys(logSettings).reduce(
    (result: logsType, key: string) => ({
      ...result,
      [key]: (...messages: $ReadOnlyArray<messageType>): mixed => {
        const {
          getName = GET_NAME[key] || GET_NAME.log,
          print,
          after = emptyFunction,
        } = logSettings[key];
        const printName = getName(name);

        messages.forEach((message: messageType) => {
          print(
            message instanceof Object
              ? JSON.stringify(message, null, 2)
              : /**
                 * https://github.com/facebook/flow/issues/2282
                 * instanceof not work
                 *
                 * $FlowFixMe
                 */
                `${printName} ${(message: string)}`,
          );
        });

        return after(name);
      },
    }),
    ({}: logsType),
  );

  return init
    ? {
        init: (...args: $ReadOnlyArray<mixed>): logsType => {
          init(...args);

          return logs;
        },
      }
    : logs;
};
