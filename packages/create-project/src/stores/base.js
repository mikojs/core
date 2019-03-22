// @flow

import debug from 'debug';

import pkg from './pkg';
import gitignore from './gitignore';
import npmignore from './npmignore';
import configs from './configs';
import flow from './flow';
import license from './license';
import readme from './readme';
import circleci from './circleci';
import Store from './index';

const debugLog = debug('create-project:store:base');

/** base store */
class Base extends Store {
  subStores = [
    pkg,
    gitignore,
    npmignore,
    configs,
    flow,
    license,
    readme,
    circleci,
  ];

  /**
   * @example
   * base.init(ctx)
   *
   * @param {Object} ctx - store context
   */
  init = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const storeNames = [];
    const stores = (await this.run(ctx)).filter(
      ({ constructor: { name } }: Store): boolean => {
        if (storeNames.includes(name)) return false;

        storeNames.push(name);
        return true;
      },
    );

    debugLog(stores);

    for (const store of stores) await store.end(ctx);

    const { pkg: { repository } = {} } = ctx;

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
