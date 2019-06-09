// @flow

import Store from './index';

import template from 'templates/flowconfig';

/** flow store */
class Flow extends Store {
  /**
   * @example
   * flow.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna, useStyles }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.writeFiles({
      '.flowconfig': template(useStyles),
    });
    await this.execa('yarn add --dev flow-bin flow-typed');
  };
}

export default new Flow();
