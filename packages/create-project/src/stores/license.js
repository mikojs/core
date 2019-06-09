// @flow

import Store from './index';

import template from 'templates/license';

/** license store */
class License extends Store {
  /**
   * @example
   * license.end()
   *
   * @param {Object} ctx - store context
   */
  +end = async ({
    lerna,
    pkg: { author } = {},
  }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.writeFiles({
      LICENSE: template(author),
    });
  };
}

export default new License();
