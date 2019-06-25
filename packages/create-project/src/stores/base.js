// @flow

import execa from 'execa';

import { version } from '../../package.json';

import server from './server';
import pkg from './pkg';
import gitignore from './gitignore';
import npmignore from './npmignore';
import configs from './configs';
import flow from './flow';
import license from './license';
import readme from './readme';
import circleci from './circleci';
import Store from './index';

/** base store */
class Base extends Store {
  +subStores = [
    server,
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
   * @param {storeContext} ctx - store context
   */
  +init = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const storeNames = [];
    const stores = (await this.run(ctx)).filter(
      ({ constructor: { name } }: Store): boolean => {
        if (storeNames.includes(name)) return false;

        storeNames.push(name);
        return true;
      },
    );

    this.debug(stores);

    for (const store of stores) await store.end(ctx);
    await this.end(ctx);
  };

  /**
   * @example
   * bese.end(ctx)
   *
   * @param {storeContext} ctx - store context
   */
  +end = async ({
    projectDir,
    lerna,
    pkg: { repository } = {},
  }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.execa('yarn flow-typed install');

    try {
      await execa('git', ['status'], {
        cwd: projectDir,
      });
    } catch (e) {
      if (
        !/fatal: not a git repository \(or any of the parent directories\): \.git/.test(
          e.stderr,
        )
      )
        return;

      await this.execa(
        'git init',
        'git add .',
        `git commit -m "chore(root): project init, create-project: v${version}"`,
        ...(repository ? [`git remote add origin ${repository}`] : []),
      );
    }
  };
}

export default new Base();
