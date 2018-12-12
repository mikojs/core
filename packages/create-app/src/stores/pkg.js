// @flow

import path from 'path';

import memoizeOne from 'memoize-one';

import Store from './index';

import type { ctxType } from './index';

import getEngines from 'utils/getEngines';
import getUser from 'utils/getUser';

/** store pkg */
class Pkg extends Store {
  store: {
    [string]: string,
    engines?: {
      [string]: string,
    },
    husky: {
      hooks: {
        [string]: string,
      },
    },
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

      this.store.name = path.basename(projectDir);
      this.store.engines = await getEngines();
      this.store.author = `${username} <${email}>`;
    },
  );

  /**
   * @example
   * pkg.start({ projectDir: '/path' })
   *
   * @param {Object} ctx - store context
   */
  start = async ({ projectDir }: ctxType): Promise<void> => {
    await this.defaultInfo(projectDir);
  };
}

export default new Pkg();
