// @flow

import Store from './index';

import type { ctxType } from './index';

/** configs store */
class Configs extends Store {
  /**
   * @example
   * configs.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  end = async ({ cmd }: ctxType): Promise<void> => {
    await this.execa(
      'git init',
      // TODO: modify after @cat-org/configs production
      `${
        cmd === 'npm' ? 'npm install -D' : 'yarn add --dev'
      } @cat-org/configs@beta`,
      ...['babel', 'prettier', 'lint', 'lint-staged', 'jest'].map(
        (configName: string) =>
          `configs-scripts --install ${
            cmd === 'npm' ? '--npm ' : ''
          }${configName}`,
      ),
    );
  };
}

export default new Configs();
