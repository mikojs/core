// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import react from './react';
import pkg from './pkg';
import Store from './index';

const template = ` // @flow

import { version } from '../../../package.json';

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

  storeUse = {
    server: false,
    graphql: false,
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

    this.storeUse = {
      server: useServer,
      graphql: useGraphql,
    };
    this.debug(this.storeUse);
  }, emptyFunction.thatReturnsTrue);

  /**
   * @example
   * server.store(ctx)
   *
   * @param {Object} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkServer();

    ctx.useServer = this.storeUse.server;
  };

  /**
   * @example
   * server.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUse.server || lerna) return;

    await this.execa(
      `yarn add @cat-org/server @cat-org/koa-base${
        !this.storeUse.graphql ? '' : ' @cat-org/koa-graphql'
      }`,
    );

    if (this.storeUse.graphql)
      await this.writeFiles({
        'src/graphql/index.js': template,
      });
  };
}

export default new Server();
