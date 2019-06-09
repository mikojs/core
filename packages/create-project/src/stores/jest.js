// @flow

import Store from './index';

import template from 'templates/tests/server';

/** jest store */
class Jest extends Store {
  /**
   * @example
   * jest.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({
    useReact,
    useGraphql,
    lerna,
  }: $PropertyType<Store, 'ctx'>) => {
    if (!useReact && !useGraphql) return;

    await this.writeFiles({
      './src/__tests__/server.js': template(useReact, useGraphql),
    });

    if (lerna) return;

    await this.execa('yarn add --dev node-fetch');
  };
}

export default new Jest();
