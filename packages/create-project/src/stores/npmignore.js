// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import readme from './readme';
import circleci from './circleci';
import Store from './index';

import template from 'templates/npmignore';

/** npmignore store */
class Npmignore extends Store {
  +subStores = [readme, circleci];

  storeUseNpm = false;

  /**
   * @example
   * npmignore.checkNpm()
   */
  +checkNpm = memoizeOne(async () => {
    this.storeUseNpm = (await this.prompt({
      name: 'useNpm',
      message: 'use npm or not',
      type: 'confirm',
      default: false,
    })).useNpm;
    this.debug(this.storeUseNpm);
  }, emptyFunction.thatReturnsTrue);

  /**
   * @example
   * npmignore.start(ctx)
   *
   * @param {Object} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkNpm();

    ctx.useNpm = this.storeUseNpm;
  };

  /**
   * @example
   * npmignore.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUseNpm) return;

    await this.writeFiles({
      '.npmignore': template(lerna),
    });
  };
}

export default new Npmignore();
