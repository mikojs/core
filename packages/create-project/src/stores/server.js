// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import pkg from './pkg';
import Store from './index';

const template = `// @flow

import React from 'react';

const Home = () => <div>@cat-org/create-project</div>;

export default Home;`;

/** server store */
class Server extends Store {
  subStores = [pkg];

  storeUseServer = false;

  /**
   * @example
   * server.checkServer()
   */
  checkServer = memoizeOne(async () => {
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
  start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkServer();

    ctx.useServer = this.storeUseServer;
  };

  /**
   * @example
   * pkg.end(ctx)
   */
  end = async () => {
    if (!this.storeUseServer) return;

    await this.writeFiles({
      'src/pages/index.js': template,
    });
    await this.execa(
      'yarn add --dev @cat-org/server @cat-org/default-middleware @cat-org/react-middleware',
    );
  };
}

export default new Server();
