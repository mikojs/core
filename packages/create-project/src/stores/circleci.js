// @flow

import Store from './index';

import template from 'templates/circleci';

/** circleci store */
class Circleci extends Store {
  /**
   * @example
   * circleci.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna, useNpm }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.writeFiles({
      '.circleci/config.yml': template(useNpm),
    });
  };
}

export default new Circleci();
