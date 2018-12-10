// @flow

import path from 'path';

import envinfo from 'envinfo';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { isURL } from 'validator';

import user from './user';
import Cache from './index';

type validateType = (val: string & $ReadOnlyArray<string>) => boolean | string;

type questionOptionType = {
  name: string,
  type?: string,
  default?: mixed,
  filter?: (val: string) => mixed,
};

type storeType = {
  [string]: string,
  engines?: {
    [string]: string,
  },
  husky: {
    hooks: {
      [string]: string,
    },
  },
};

/**
 * @example
 * defaultValidate('')
 *
 * @param {string} val - input value
 * @return {boolean} - validate result
 */
export const defaultValidate = (val: string) =>
  val !== '' || 'can not be empty';

export const questions: $ReadOnlyArray<
  questionOptionType & {
    message: string,
    validate: validateType,
    prefix: string,
    suffix: string,
  },
> = [
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
    validate: (val: string) =>
      isURL(val, { require_protocol: true }) ||
      'must be url, for example: https://cat.org',
  },
  {
    name: 'repository',
    validate: (val: string) =>
      isURL(val, {
        protocols: ['https'],
        require_protocol: true,
        host_whitelist: ['github.com'],
      }) ||
      /git@github\.com:[\w-]*\/[\w-]*\.git/.test(val) ||
      'must be url or git ssh, for example: https://github.com/cat-org/cat-core.git',
  },
  {
    name: 'keywords',
    message: 'keywords (comma to split)',
    filter: (val: string) =>
      val.split(/\s*,\s*/g).filter((d: string) => d !== ''),
    validate: (val: $ReadOnlyArray<string>) =>
      val.length !== 0 || 'can not be empty',
  },
].map(
  ({
    name,
    message = name,
    validate = defaultValidate,
    ...options
  }: questionOptionType & {
    message?: string,
    validate?: validateType,
  }) => ({
    ...options,
    name,
    message,
    validate,
    prefix: chalk`{bold {blue ℹ create-app}}`,
    suffix: chalk`{green  ➜}`,
  }),
);

/** pkg cache */
class Pkg extends Cache<storeType> {
  store: storeType = {
    license: 'MIT',
    version: '1.0.0',
    main: './lib/index.js',
    husky: {
      hooks: {
        'pre-commit': 'configs lint-staged && yarn flow',
      },
    },
  };

  /**
   * @example
   * pkg.init()
   *
   * @param {string} projectDir - project dir path
   */
  init = async (projectDir: string): Promise<void> => {
    // store name
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

    // store author
    const { username, email } = await user.get(projectDir);

    this.store.author = `${username} <${email}>`;

    // ask for more information
    const { private: isPrivate, ...info } = await inquirer.prompt(questions);

    this.store = {
      ...this.store,
      ...info,
      ...(isPrivate
        ? {
            private: true,
          }
        : {
            publishConfig: {
              access: 'public',
            },
          }),
    };
  };
}

export default new Pkg();
