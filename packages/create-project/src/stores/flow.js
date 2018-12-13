// @flow

import Store from './index';

import type { ctxType } from './index';

export const template = `[ignore]

[include]

[libs]
./flow-typed

[lints]

[options]
module.system.node.resolve_dirname=node_modules
module.system.node.resolve_dirname=./src

[strict]`;

/** flow store */
class Flow extends Store {
  /**
   * @example
   * flow.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  end = async ({ cmd }: ctxType): Promise<void> => {
    this.writeFiles({
      '.flowconfig': template,
    });

    await this.execa(
      `${
        cmd === 'npm' ? 'npm install -D' : 'yarn add --dev'
      } flow-bin flow-typed`,
    );
  };
}

export default new Flow();
