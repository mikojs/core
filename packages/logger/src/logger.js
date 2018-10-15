// @flow

import { emptyFunction } from 'fbjs';

import chalk from './chalkPolyfill';

import defaultLogSettings from './settings/log';

const GET_NAME = {
  log: (name: string): string => chalk`{gray   {bold ${name}}}`,
  succeed: (name: string): string => chalk`{green ✔ {bold ${name}}}`,
  fail: (name: string): string => chalk`{red ✖ {bold ${name}}}`,
  warn: (name: string): string => chalk`{yellow ⚠ {bold ${name}}}`,
  info: (name: string): string => chalk`{blue ℹ {bold ${name}}}`,
};

export default (name: string, logSettings: {} = defaultLogSettings) =>
  Object.keys(logSettings).reduce(
    (result: {}, key: string) => ({
      ...result,
      [key]: (...messages: $ReadOnlyArray<string>) => {
        const {
          getName = GET_NAME[key] || GET_NAME.log,
          print,
          after = emptyFunction,
        } = logSettings[key];
        const printName = getName(name);

        messages.forEach((message: string) => {
          print(`${printName} ${message}`);
        });

        after();
      },
    }),
    {},
  );
