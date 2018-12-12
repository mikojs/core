// @flow

import path from 'path';

import memoizeOne from 'memoize-one';
import inquirer from 'inquirer';
import { isURL } from 'validator';

import Store from './index';

import type { ctxType } from './index';

import getEngines from 'utils/getEngines';
import getUser from 'utils/getUser';
import normalizedQuestions from 'utils/normalizedQuestions';

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
      isURL(val, { require_protocol: true }) ||
      /^git@.*:.*\.git$/.test(val) ||
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

/** store pkg */
class Pkg extends Store {
  storePkg: {
    [string]: string,
    husky: {
      hooks: {
        [string]: string,
      },
    },
    engines?: {
      [string]: string,
    },
    private?: boolean,
  } = {
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
   * pkg.defaultInfo('/path')
   *
   * @param {string} projectDir - project dir
   */
  defaultInfo = memoizeOne(
    async (projectDir: string): Promise<void> => {
      const [username, email] = await getUser();
      const questionResult = await inquirer.prompt(
        normalizedQuestions<$ReadOnlyArray<string>>(...PKG_QUESTIONS),
      );

      this.storePkg.name = path.basename(projectDir);
      this.storePkg.engines = await getEngines();
      this.storePkg.author = `${username} <${email}>`;

      Object.keys(questionResult).forEach((key: string) => {
        if (key === 'private') {
          if (questionResult[key]) this.storePkg.private = true;

          return;
        }

        this.storePkg[key] = questionResult[key];
      });
    },
  );

  /**
   * @example
   * pkg.start(ctx)
   *
   * @param {Object} ctx - store context
   */
  start = async ({ projectDir }: ctxType): Promise<void> => {
    await this.defaultInfo(projectDir);
  };

  /**
   * @example
   * pkg.end(ctx)
   */
  end = async (): Promise<void> => {
    this.writeFiles({
      'package.json': JSON.stringify(this.storePkg, null, 2),
    });
  };
}

export default new Pkg();
