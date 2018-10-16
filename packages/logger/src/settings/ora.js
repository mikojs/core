// @flow

import ora from 'ora';
import chalk from 'chalk';
import { invariant } from 'fbjs';

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
  getFunc = (): {} => {
    this.func = {
      init: {
        getName: GET_NAME.log,
        print: (options: mixed) => {
          this.store = ora(options);
        },
        after: this.after,
      },
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
        after: this.after,
      };
    });

    return this.func;
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
