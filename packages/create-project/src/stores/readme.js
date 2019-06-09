// @flow

import { invariant } from 'fbjs';

import Store from './index';

import template from 'templates/readme';

/** readme store */
class Readme extends Store {
  /**
   * @example
   * readme.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna, pkg, useNpm }: $PropertyType<Store, 'ctx'>) => {
    invariant(pkg, 'Can not run readme store without pkg in `ctx`');

    await this.writeFiles({
      'README.md': template(lerna, pkg, useNpm),
    });
  };
}

export default new Readme();
