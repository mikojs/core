// @flow

import Store from 'stores';

export default (
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
module.system.node.resolve_dirname=node_modules
module.system.node.resolve_dirname=./src

[strict]`;
