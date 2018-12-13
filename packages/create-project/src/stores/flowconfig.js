// @flow

import Store from './index';

export const template = `[ignore]
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

/** flowconfig store */
class Flowconfig extends Store {
  /**
   * @example
   * flowconfig.end()
   */
  end = () => {
    this.writeFiles({
      '.flowconfig': template,
    });
  };
}

export default new Flowconfig();
