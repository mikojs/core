// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import react from './react';
import pkg from './pkg';
import graphql from './graphql';
import Store from './index';

/** server store */
class Server extends Store {
  +subStores = [react, graphql, pkg];

  storeUseServer = false;

  /**
   * @example
   * server.checkServer()
   */
  +checkServer = memoizeOne(async () => {
    this.storeUseServer = (await this.prompt({
      name: 'useServer',
      message: 'use server or not',
      type: 'confirm',
      default: false,
    })).useServer;
    this.debug(this.storeUseServer);
  }, emptyFunction.thatReturnsTrue);

  /**
   * @example
   * server.start(ctx)
   *
   * @param {Object} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkServer();

    ctx.useServer = this.storeUseServer;
  };

  /**
   * @example
   * server.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (lerna || !this.storeUseServer) return;

    await this.execa('yarn configs --install server');
  };
}

export default new Server();
