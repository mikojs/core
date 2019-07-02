// @flow

import memoizeOne from 'memoize-one';

import relay from './relay';
import styles from './styles';
import jest from './jest';
import configs from './configs';
import gitignore from './gitignore';
import Store from './index';

const template = `// @flow

import React from 'react';

const Home = () => <div>@cat-org/create-project</div>;

export default Home;`;

/** react store */
class React extends Store {
  +subStores = [relay, styles, jest, configs, gitignore];

  storeUseReact = false;

  /**
   * @example
   * react.checkReact()
   */
  +checkReact = memoizeOne(
    async (
      useServer: $PropertyType<$PropertyType<Store, 'ctx'>, 'useServer'>,
    ) => {
      if (useServer)
        this.storeUseReact = (await this.prompt({
          name: 'useReact',
          message: 'use react or not',
          type: 'confirm',
          default: false,
        })).useReact;
      else this.storeUseReact = false;

      this.debug(this.storeUseReact);
    },
  );

  /**
   * @example
   * react.start(ctx)
   *
   * @param {storeContext} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const { useServer } = ctx;

    await this.checkReact(useServer);

    // TODO: https://github.com/eslint/eslint/issues/11899
    // eslint-disable-next-line require-atomic-updates
    ctx.useReact = this.storeUseReact;
  };

  /**
   * @example
   * react.end(ctx)
   *
   * @param {storeContext} ctx - store context
   */
  +end = async ({ lerna, useGraphql }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUseReact) return;

    if (!useGraphql)
      await this.writeFiles({
        'src/pages/index.js': template,
      });

    if (lerna) return;

    await this.execa(
      'yarn add react react-dom @cat-org/koa-react',
      'yarn add --dev webpack @babel/preset-react @babel/plugin-proposal-class-properties',
    );
  };
}

export default new React();
