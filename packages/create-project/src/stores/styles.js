// @flow

import memoizeOne from 'memoize-one';

import flow from './flow';
import configs from './configs';
import Store from './index';

/** styles store */
class Styles extends Store {
  +subStores = [configs, flow];

  storeUseStyles = false;

  /**
   * @example
   * styles.checkStyles()
   */
  +checkStyles = memoizeOne(
    async (
      useReact: $PropertyType<$PropertyType<Store, 'ctx'>, 'useReact'>,
    ) => {
      if (useReact)
        this.storeUseStyles = (await this.prompt({
          name: 'useStyles',
          message: 'use styles',
          type: 'list',
          default: 0,
          choices: [
            {
              name: 'less',
            },
            {
              name: 'css',
            },
            {
              name: 'not use',
              value: false,
            },
          ],
        })).useStyles;
      else this.storeUseStyles = false;

      this.debug(this.storeUseStyles);
    },
  );

  /**
   * @example
   * styles.start(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const { useReact } = ctx;

    await this.checkStyles(useReact);

    // TODO: https://github.com/eslint/eslint/issues/11899
    // eslint-disable-next-line require-atomic-updates
    ctx.useStyles = this.storeUseStyles;
  };

  /**
   * @example
   * styles.end(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUseStyles) return;

    await this.execa(
      `yarn add ${[
        '@mikojs/use-css',
        ...(this.storeUseStyles !== 'less' ? [] : ['@mikojs/use-less']),
      ].join(' ')}`,
    );

    if (lerna) return;

    await this.execa(
      'yarn add --dev babel-plugin-css-modules-transform @mikojs/babel-plugin-import-css',
    );
  };
}

export default new Styles();
