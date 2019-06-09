// @flow

import Store from './index';

import template from 'templates/gitignore';

/** gitignore store */
class Gitignore extends Store {
  /**
   * @example
   * gitignore.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.writeFiles({
      '.gitignore': template,
    });
  };
}

export default new Gitignore();
