// @flow

import pkg from './pkg';
import gitignore from './gitignore';
import npmignore from './npmignore';
import configs from './configs';
import flow from './flow';
import Store from './index';

import type { ctxType } from './index';

/** base store */
class Base extends Store {
  subStores = [pkg, gitignore, npmignore, configs, flow];

  /**
   * @example
   * bese.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  end = async ({ cmd, pkg: { repository } = {} }: ctxType): Promise<void> => {
    await this.execa(
      'yarn flow-typed install',
      'git add .',
      'git commit -m "chore(root): project init"',
      ...(repository ? [`git remote add origin ${repository}`] : []),
      // TODO: add checker
    );
  };
}

export default new Base();
