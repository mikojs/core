// @flow

import Store from './index';

/**
 * @example
 * template(false)
 *
 * @param {boolean} useStyles - use styles or not
 *
 * @return {string} - template string
 */
const template = (
  useStyles: $PropertyType<$PropertyType<Store, 'ctx'>, 'useStyles'>,
) => `[ignore]
# just for findup
.*/node_modules/findup/test/.*

[include]

[libs]
./flow-typed

[lints]

[options]${
  !useStyles
    ? ''
    : `
module.file_ext=.js
${useStyles === 'less' ? 'module.file_ext=.less' : 'module.file_ext=.css'}`
}
module.ignore_non_literal_requires=true
module.system.node.resolve_dirname=node_modules
module.system.node.resolve_dirname=./src

[strict]`;

/** flow store */
class Flow extends Store {
  /**
   * @example
   * flow.end(ctx)
   *
   * @param {storeContext} ctx - store context
   */
  +end = async ({ lerna, useStyles }: $PropertyType<Store, 'ctx'>) => {
    if (lerna) return;

    await this.writeFiles({
      '.flowconfig': template(useStyles),
    });
    await this.execa('yarn add --dev flow-bin flow-typed');
  };
}

export default new Flow();
