// @flow

import Store from './index';

/**
 * @example
 * template(['react'])
 *
 * @param {Array} configsEnv - configs env
 *
 * @return {string} - content
 */
const template = (configsEnv: $ReadOnlyArray<string>) => `// @flow

module.exports = {
  configsEnv: [${configsEnv.map((env: string) => `'${env}'`).join(', ')}],
};`;

/** configs store */
class Configs extends Store {
  /**
   * @example
   * configs.end(ctx)
   *
   * @param {storeContext} ctx - store context
   */
  +end = async ({
    lerna,
    useServer,
    useReact,
    useGraphql,
    useStyles,
  }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.execa(
      'yarn add --dev @cat-org/configs',
      ...['babel', 'prettier', 'lint', 'lint-staged', 'jest'].map(
        (configName: string) => `yarn configs --install ${configName}`,
      ),
      ...(!useServer ? [] : ['yarn configs --install server']),
    );

    const configsEnv = [];

    if (useReact) {
      configsEnv.push('react');

      if (useGraphql) configsEnv.push('relay');
    }

    if (useStyles) configsEnv.push(useStyles);

    if (configsEnv.length !== 0)
      await this.writeFiles({
        '.catrc.js': template(configsEnv),
      });
  };
}

export default new Configs();
