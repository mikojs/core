// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import Store from './index';

/**
 * @example
 * template(false)
 *
 * @param {boolean} lerna - lerna option
 *
 * @return {string} - content
 */
const template = (lerna: boolean) =>
  lerna
    ? `# babel
src`
    : `# default
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
  storeUseNpm = false;

  /**
   * @example
   * npmignore.checkNpm()
   */
  +checkNpm = memoizeOne(async () => {
    this.storeUseNpm = (
      await this.prompt({
        name: 'useNpm',
        message: 'use npm or not',
        type: 'confirm',
        default: false,
      })
    ).useNpm;
    this.debug(this.storeUseNpm);
  }, emptyFunction.thatReturnsTrue);

  /**
   * @example
   * npmignore.start(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkNpm();

    ctx.useNpm = this.storeUseNpm;
  };

  /**
   * @example
   * npmignore.end(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUseNpm) return;

    await this.writeFiles({
      '.npmignore': template(lerna),
    });
  };
}

export default new Npmignore();
