// @flow

import Store from './index';

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
   * flow.end()
   */
  end = async () => {
    await this.writeFiles({
      '.flowconfig': template,
    });
    await this.execa('yarn add --dev flow-bin flow-typed');
  };
}

export default new Flow();
