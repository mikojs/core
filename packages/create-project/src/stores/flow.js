// @flow

import Store, { type ctxType } from './index';

const template = `[ignore]
# just for findup
.*/node_modules/findup/test/.*

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
  end = async ({ cmd }: ctxType) => {
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
