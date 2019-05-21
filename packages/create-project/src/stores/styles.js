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
   * styles.store(ctx)
   *
   * @param {Object} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const { useReact } = ctx;

    await this.checkStyles(useReact);

    ctx.useStyles = this.storeUseStyles;
  };

  /**
   * @example
   * styles.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({ lerna }: $PropertyType<Store, 'ctx'>) => {
    if (!this.storeUseStyles) return;

    this.execa(
      this.storeUseStyles === 'less'
        ? 'yarn add @cat-org/ues-less'
        : 'yarn add @cat-org/use-css',
      'yarn add --dev babel-plugin-css-modules-transform @cat-org/import-css',
    );
  };
}

export default new Styles();
