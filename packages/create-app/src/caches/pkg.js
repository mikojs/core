// @flow

import path from 'path';

import envinfo from 'envinfo';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { isURL } from 'validator';

import user from './user';
import Cache from './index';

type storeType = {
  [string]: string,
  engines?: {
    [string]: string,
  },
};

/**
 * @example
 * defaultValidate('')
 *
 * @param {string} val - input value
 * @return {boolean} - validate result
 */
const defaultValidate = (val: string) => val !== '' || 'can not be empty';

/** pkg cache */
class Pkg extends Cache<storeType> {
  store: storeType = {
    license: 'MIT',
    version: '1.0.0',
    main: './lib/index.js',
  };

  /**
   * @example
   * pkg.init()
   *
   * @param {string} projectDir - project dir path
   */
  init = async (projectDir: string): Promise<void> => {
    this.store.name = path.basename(projectDir);

    // store engines
    const { Binaries } = JSON.parse(
      await envinfo.run(
        {
          Binaries: ['Node', 'Yarn', 'npm'],
        },
        { json: true },
      ),
    );

    this.store.engines = Object.keys(Binaries)
      .filter((key: string) => Binaries[key])
      .reduce(
        (result: {}, key: string) => ({
          ...result,
          [key.toLowerCase()]: `>= ${Binaries[key].version}`,
        }),
        {},
      );

    /**
     * get user
     *
     * https://github.com/facebook/flow/issues/7169
     * $FlowFixMe
     */
    const { username, email } = await user.get(projectDir);

    this.store.author = `${username} <${email}>`;

    // ask for more information
    this.store = {
      ...this.store,
      ...(await inquirer
        .prompt(
          [
            {
              name: 'private',
              type: 'confirm',
              default: false,
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
              validate?: (
                val: string & $ReadOnlyArray<string>,
              ) => boolean | string,
            }) => ({
              ...options,
              name,
              message,
              validate,
              prefix: chalk`{gray question}`,
              suffix: chalk`{green  ➜}`,
            }),
          ),
        )
        .then(({ private: isPrivate, ...result }: { private: boolean }) => ({
          ...result,
          ...(isPrivate
            ? {
                private: true,
              }
            : {
                publishConfig: {
                  access: 'public',
                },
              }),
        }))),
    };
  };
}

export default new Pkg();
