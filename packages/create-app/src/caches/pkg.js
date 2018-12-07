// @flow

import path from 'path';

import envinfo from 'envinfo';
import inquirer from 'inquirer';
import { isURL } from 'validator';

import { normalizedQuestions } from '@cat-org/utils';

import user from './user';
import Cache from './index';

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

export const PKG_QUESTIONS = [
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
    filter: (val: string): $ReadOnlyArray<string> =>
      val.split(/\s*,\s*/g).filter((d: string) => d !== ''),
    validate: (val: $ReadOnlyArray<string>) =>
      val.length !== 0 || 'can not be empty',
  },
];

/** pkg cache */
class Pkg extends Cache<storeType> {
  store: storeType = {
    license: 'MIT',
    version: '1.0.0',
    main: './lib/index.js',
    husky: {
      hooks: {
        'pre-commit': 'configs-scripts lint-staged && yarn flow',
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
    const { private: isPrivate, ...info } = await inquirer.prompt(
      normalizedQuestions('create-app')<$ReadOnlyArray<string>>(
        ...PKG_QUESTIONS,
      ),
    );

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
