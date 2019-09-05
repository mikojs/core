// @flow

import { emptyFunction } from 'fbjs';

import chalk from './utils/chalkPolyfill';

type messageType = string | {};
type logType = (...messages: $ReadOnlyArray<messageType>) => logsType;
type funcSettingType = (message: string) => void;
type objSettingType = {|
  getName?: (name: string) => string,
  print: funcSettingType,
  after?: (name: string) => mixed,
|};

export type logsType = {
  [string]: logType,
  fail: (...messages: $ReadOnlyArray<messageType>) => Error | void,
};

export type settingsType = {
  init?: (...args: $ReadOnlyArray<mixed>) => void,
  [string]: funcSettingType | objSettingType,
};

const GET_NAME = {
  log: (name: string) => chalk`{gray   {bold ${name}}}`,
  succeed: (name: string) => chalk`{green ✔ {bold ${name}}}`,
  fail: (name: string) => chalk`{red ✖ {bold ${name}}}`,
  warn: (name: string) => chalk`{yellow ⚠ {bold ${name}}}`,
  info: (name: string) => chalk`{blue ℹ {bold ${name}}}`,
};

/**
 * @example
 * findSettings('log')
 *
 * @param {string} settingsName - name of settings
 *
 * @return {settingsType} - settings
 */
const findSettings = (settingsName: string): ?settingsType => {
  switch (settingsName) {
    case 'log':
      return require('./settings/log').default || require('./settings/log');
    case 'ora':
      return require('./settings/ora').default || require('./settings/ora');
    default:
      return null;
  }
};

/**
 * @example
 * logger('name')
 *
 * @param {string} name - logger name
 * @param {string | { key: string }} settingsNameOrObj - settings name or settings object
 *
 * @return {logsType} - logger
 */
export default (
  name: string,
  settingsNameOrObj?: string | settingsType = 'log',
):
  | {
      [string]: (...messages: $ReadOnlyArray<messageType>) => logsType,
      init: (...args: $ReadOnlyArray<mixed>) => logsType,
    }
  | logsType => {
  const { init, ...logSettings }: settingsType =
    settingsNameOrObj instanceof Object
      ? settingsNameOrObj
      : /**
         * TODO: https://github.com/facebook/flow/issues/2282
         * instanceof not work
         *
         * $FlowFixMe
         */
        findSettings(settingsNameOrObj) || {};
  const logs = Object.keys(logSettings).reduce(
    (result: logsType, key: string) => ({
      ...result,
      [key]: (...messages: $ReadOnlyArray<messageType>): mixed => {
        const {
          getName = GET_NAME[key] || GET_NAME.log,
          print,
          after = emptyFunction,
        }: objSettingType =
          typeof logSettings[key] !== 'function'
            ? logSettings[key]
            : { print: logSettings[key] };
        const printName = getName(name);

        messages.forEach((message: messageType) => {
          print(
            message instanceof Object
              ? JSON.stringify(message, null, 2)
              : /**
                 * TODO: https://github.com/facebook/flow/issues/2282
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
