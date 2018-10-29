// @flow

import { options } from '@babel/cli/lib/babel/options';
import { outputFileSync } from 'output-file-sync';

import utils from '../../utils';
import flowFiles from '../../flowFiles';

export default (newOptions?: null | {} = null) => {
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
    plugins: [],
  };

  // reset flowFiles
  flowFiles.store = [];
  flowFiles.watcher = null;

  // reinitialize options
  options.cliOptions = newOptions;
  utils.initializeOptions({ watch: false });

  // reset outputFileSync
  outputFileSync.destPaths = [];
};
