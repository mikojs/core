// @flow

import path from 'path';

import inquirer from 'inquirer';
import chalk from 'chalk';
import { isURL } from 'validator';

/**
 * @example
 * defaultValidate('')
 *
 * @param {string} val - input value
 * @return {boolean} - validate result
 */
const defaultValidate = (val: string) => val !== '' || 'can not be empty';

/** store pkg */
class Pkg {
  store = {};

  /**
   * @example
   * pkg.write('/root')
   *
   * @param {string} root - root to parse name
   */
  write = async (root: string): Promise<void> => {
    this.store = await inquirer.prompt(
      [
        {
          name: 'private',
          type: 'confirm',
          default: false,
        },
        {
          name: 'name',
          default: path.basename(root),
        },
        {
          name: 'description',
        },
        {
          name: 'homepage',
          validate: (val: string) => isURL(val) || 'must be url',
        },
        {
          name: 'repository',
          validate: (val: string) =>
            isURL(val) ||
            /git@github\.com:[\w-]*\/[\w-]*\.git/.test(val) ||
            'must be url or git ssh',
        },
        {
          name: 'keywords',
          message: 'keywords (comma to split)',
          filter: (val: string) =>
            val.split(/\s*,\s*/g).filter((d: string) => d !== ''),
          validate: (val: $ReadOnlyArray<string>) =>
            val.length !== 0 ? true : 'can not be empty',
        },
      ].map(
        ({
          name,
          message = name,
          validate = defaultValidate,
          ...options
        }: {
          name: string,
          type?: string,
          default?: mixed,
          message?: string,
          filter?: (val: string) => mixed,
          validate?: (val: string & $ReadOnlyArray<string>) => boolean | string,
        }) => ({
          ...options,
          name,
          message,
          validate,
          prefix: chalk`{gray question}`,
          suffix: chalk`{green  ➜}`,
        }),
      ),
    );
  };
}

export default new Pkg();
