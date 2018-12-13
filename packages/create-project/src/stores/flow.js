// @flow

import Store from './index';

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
   * flow.end()
   */
  end = () => {
    this.writeFiles({
      '.flowconfig': template,
    });
  };
}

export default new Flow();
