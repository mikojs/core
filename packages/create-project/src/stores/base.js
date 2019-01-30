// @flow

import pkg from './pkg';
import gitignore from './gitignore';
import npmignore from './npmignore';
import configs from './configs';
import flow from './flow';
import license from './license';
import readme from './readme';
import Store from './index';

/** base store */
class Base extends Store {
  subStores = [pkg, gitignore, npmignore, configs, flow, license, readme];

  /**
   * @example
   * bese.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  end = async ({ pkg: { repository } = {} }: $PropertyType<Store, 'ctx'>) => {
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
