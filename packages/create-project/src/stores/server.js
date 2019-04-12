// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import react from './react';
import pkg from './pkg';
import Store from './index';

/** server store */
class Server extends Store {
  +subStores = [react, pkg];

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
   * server.store(ctx)
   *
   * @param {Object} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkServer();

    ctx.useServer = this.storeUseServer;
  };

  /**
   * @example
   * pkg.end(ctx)
   */
  +end = async () => {
    if (!this.storeUseServer) return;

    await this.execa(
      'yarn add --dev @cat-org/server @cat-org/default-middleware',
    );
  };
}

export default new Server();
