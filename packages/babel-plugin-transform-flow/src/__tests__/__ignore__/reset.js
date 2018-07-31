// @flow

import utils from '../../utils';
import flowFiles from '../../flowFiles';

export default (options: {}) => {
  // reset utils
  utils.initialized = false;
  utils.initialOptions = {
    verbose: false,
    watch: false,
    extension: /\.js\.flow$/,
  };
  utils.options = utils.initialOptions;

  // reset flowFiles
  flowFiles.store = [];
  flowFiles.watcher = null;

  // reinitialize options
  utils.initializeOptions(options);
};
