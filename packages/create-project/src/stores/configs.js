// @flow

import Store from './index';

/** configs store */
class Configs extends Store {
  /**
   * @example
   * configs.end()
   */
  end = async () => {
    await this.execa(
      'git init',
      // TODO: modify after @cat-org/configs production
      'yarn add --dev @cat-org/configs@beta',
      ...['babel', 'prettier', 'lint', 'lint-staged', 'jest'].map(
        (configName: string) => `configs --install ${configName}`,
      ),
    );
  };
}

export default new Configs();
