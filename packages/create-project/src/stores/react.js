// @flow

import memoizeOne from 'memoize-one';

import relay from './relay';
import styles from './styles';
import Store from './index';

const template = `// @flow

import React from 'react';

/** @react render the home page */
const Home = () => <div>@mikojs/create-project</div>;

export default Home;`;

const testTemplate = `// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import React from '@mikojs/koa-react';

const react = new React(path.resolve(__dirname, '../pages'));

describe('pages', () => {
  test.each\`
    url    | html
    \${'/'} | \${'<div>@mikojs/create-project</div>'}
  \`('page $url', async ({ url, html }: {| url: string, html: string |}) => {
    expect(
      (await react.render(url, {
        Loading: emptyFunction.thatReturnsNull,
      })).html(),
    ).toBe(html);
  });
});`;

/** react store */
class React extends Store {
  +subStores = [relay, styles];

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
        this.storeUseReact = (
          await this.prompt({
            name: 'useReact',
            message: 'use react or not',
            type: 'confirm',
            default: false,
          })
        ).useReact;
      else this.storeUseReact = false;

      this.debug(this.storeUseReact);
    },
  );

  /**
   * @example
   * react.start(ctx)
   *
   * @param {Store.ctx} ctx - store context
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
   * @param {Store.ctx} ctx - store context
   */
  +end = async ({ lerna, useGraphql }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUseReact) return;

    if (!useGraphql)
      await this.writeFiles({
        'src/pages/index.js': template,
        'src/__tests__/pages.js': testTemplate,
      });

    if (lerna) return;

    await this.execa(
      'yarn add react react-dom @mikojs/koa-react',
      'yarn add --dev webpack @babel/preset-react @babel/plugin-proposal-class-properties enzyme enzyme-adapter-react-16',
    );
  };
}

export default new React();
