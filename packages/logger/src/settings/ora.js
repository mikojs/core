// @flow

import ora from 'ora';
import chalk from 'chalk';
import { invariant } from 'fbjs';

import { mockChoice } from '@cat-org/utils';

import { type settingsType } from '..';

type oraType = {
  notInit: boolean,
  isSpinning: boolean,
};

const GET_NAME = {
  log: (name: string): string => chalk`{gray {bold ${name}}}`,
  succeed: (name: string): string => chalk`{green {bold ${name}}}`,
  fail: (name: string): string => chalk`{red {bold ${name}}}`,
  warn: (name: string): string => chalk`{yellow {bold ${name}}}`,
  info: (name: string): string => chalk`{blue {bold ${name}}}`,
};
const { error } = console;

/** ora store */
class OraStore {
  store = {
    notInit: true,
    isSpinning: false,
  };

  func = {};

  /**
   * @example
   * oraStore.getFunc();
   *
   * @return {Object} - settings
   */
  getFunc = (): settingsType => {
    this.func = {
      log: {
        getName: GET_NAME.log,
        print: (message: string) => {
          const { log } = console;

          invariant(!this.store.notInit, 'Run `init` before running `log`');

          if (!this.store.isSpinning) log(`  ${message}`);
        },
        after: this.after,
      },
    };

    ['start', 'succeed', 'fail', 'warn', 'info'].forEach((key: string) => {
      this.func[key] = {
        getName: GET_NAME[key] || GET_NAME.log,
        print: (message: string) => {
          invariant(
            !this.store.notInit,
            `Run \`init\` before running \`${key}\``,
          );

          this.store = this.store[key](message);
        },
        after:
          key !== 'fail'
            ? this.after
            : (): Error | void => {
                error();

                return mockChoice(
                  process.env.NODE_ENV === 'test',
                  () => new Error('process exit'),
                  process.exit,
                  1,
                );
              },
      };
    });

    return {
      ...this.func,
      init: (options: mixed) => {
        this.store = ora(options);
      },
    };
  };

  /**
   * @example
   * oraStore.after('name')
   *
   * @param {string} name - name of logger
   *
   * @return {Object} - ora object with the function of logger
   */
  after = (name: string): oraType => {
    const store = { ...this.store };

    Object.keys(this.func).forEach((key: string) => {
      const func = this.func[key];
      const printName = func.getName(name);

      store[key] = (message: string): oraType => {
        func.print(`${printName} ${message}`);

        return func.after(name);
      };
    });

    return store;
  };
}

const oraStore = new OraStore();

export default oraStore.getFunc();
