// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import Store from './index';

const template = `// @flow

import { version } from '../../package.json';

export default {
  typeDefs: \`
  type Query {
    version: String!
  }
\`,
  Query: {
    version: () => version,
  },
};`;

/** graphql store */
class Graphql extends Store {
  storeUseGraphql = false;

  /**
   * @example
   * graphql.checkGraphql()
   */
  +checkGraphql = memoizeOne(
    async (
      useServer: $PropertyType<$PropertyType<Store, 'ctx'>, 'useServer'>,
    ) => {
      if (useServer)
        this.storeUseGraphql = (await this.prompt({
          name: 'useGraphql',
          message: 'use graphql or not',
          type: 'confirm',
          default: false,
        })).useGraphql;
      else this.storeUseGraphql = false;

      this.debug(this.storeUseGraphql);
    },
    emptyFunction.thatReturnsTrue,
  );

  /**
   * @example
   * graphql.start(ctx)
   *
   * @param {Object} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const { useServer } = ctx;

    await this.checkGraphql(useServer);
  };

  /**
   * @example
   * graphql.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUseGraphql) return;

    await this.writeFiles({
      'src/graphql/index.js': template,
    });

    if (lerna) return;

    await this.execa('yarn add @cat-org/koa-graphql');
  };
}

export default new Graphql();
