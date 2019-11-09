// @flow

import memoizeOne from 'memoize-one';

import Store from './index';

/** styles store */
class Styles extends Store {
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
        this.storeUseStyles = (
          await this.prompt({
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
          })
        ).useStyles;
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
    if (lerna || !this.storeUseStyles) return;

    await this.execa(
      'yarn add @mikojs/use-css',
      'yarn add --dev babel-plugin-css-modules-transform @mikojs/babel-plugin-import-css',
    );

    if (this.storeUseStyles === 'less')
      await this.execa('yarn add @mikojs/use-less');
  };
}

export default new Styles();
