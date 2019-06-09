// @flow

import Store from './index';

import template from 'templates/catrc';

/** configs store */
class Configs extends Store {
  /**
   * @example
   * configs.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({
    lerna,
    useReact,
    useStyles,
  }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.execa(
      'yarn add --dev @cat-org/configs',
      ...['babel', 'prettier', 'lint', 'lint-staged', 'jest'].map(
        (configName: string) => `yarn configs --install ${configName}`,
      ),
      // for @cat-org/jest/lib/react
      ...(!useReact ? [] : ['yarn add --dev enzyme-adapter-react-16']),
    );

    const configsEnv = [];

    if (useReact) configsEnv.push('react');

    if (useStyles) configsEnv.push(useStyles);

    if (configsEnv.length !== 0)
      await this.writeFiles({
        '.catrc.js': template(configsEnv),
      });
  };
}

export default new Configs();
