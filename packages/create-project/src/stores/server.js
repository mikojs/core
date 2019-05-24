// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import react from './react';
import pkg from './pkg';
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

/** server store */
class Server extends Store {
  +subStores = [react, pkg];

  store = {
    useServer: false,
    useGraphql: false,
  };

  /**
   * @example
   * server.checkServer()
   */
  +checkServer = memoizeOne(async () => {
    const { useServer, useGraphql = false } = await this.prompt(
      {
        name: 'useServer',
        message: 'use server or not',
        type: 'confirm',
        default: false,
      },
      {
        name: 'useGraphql',
        message: 'use graphql or not',
        type: 'confirm',
        default: false,
        when: (result: {| useServer: boolean |}) => result.useServer,
      },
    );

    this.store = {
      useServer,
      useGraphql,
    };
    this.debug(this.store);
  }, emptyFunction.thatReturnsTrue);

  /**
   * @example
   * server.start(ctx)
   *
   * @param {Object} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkServer();

    ctx.useServer = this.store.useServer;
  };

  /**
   * @example
   * server.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (!this.store.useServer) return;

    if (!lerna)
      await this.execa(
        `yarn add @cat-org/server @cat-org/koa-base${
          !this.store.useGraphql ? '' : ' @cat-org/koa-graphql'
        }`,
      );

    if (this.store.useGraphql)
      await this.writeFiles({
        'src/graphql/index.js': template,
      });
  };
}

export default new Server();
