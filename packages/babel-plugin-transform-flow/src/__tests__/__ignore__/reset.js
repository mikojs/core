// @flow

import utils from '../../utils';
import flowFiles from '../../flowFiles';

export default () => {
  // reset utils
  utils.initialized = false;
  utils.initialOptions = {
    verbose: false,
    watch: false,
  };
  utils.options = {
    ...utils.initialOptions,
    src: ['src'],
    outDir: 'lib',
    configs: { parserOpts: {} },
  };

  // reset flowFiles
  flowFiles.store = [];
  flowFiles.watcher = null;

  // reinitialize options
  utils.initializeOptions({ watch: false });
};
