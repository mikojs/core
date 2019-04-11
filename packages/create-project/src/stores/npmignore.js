// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import readme from './readme';
import circleci from './circleci';
import Store from './index';

const template = `# default
*.log

# node
node_modules

# babel
src

# eslint
.eslintcache

# flow
.flowignore
flow-typed

# jest
coverage
__tests__
__mocks__

# circleci
.circleci`;

/** npmignore store */
class Npmignore extends Store {
  subStores = [readme, circleci];

  storeUseNpm = false;

  /**
   * @example
   * npmignore.checkNpm()
   */
  checkNpm = memoizeOne(async () => {
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
   * npmignore.store(ctx)
   *
   * @param {Object} ctx - store context
   */
  start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkNpm();

    ctx.useNpm = this.storeUseNpm;
  };

  /**
   * @example
   * npmignore.end()
   */
  end = async () => {
    if (this.storeUseNpm)
      await this.writeFiles({
        '.npmignore': template,
      });
  };
}

export default new Npmignore();
