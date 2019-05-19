// @flow

import { options } from '@babel/cli/lib/babel/options';
import { outputFileSync } from 'output-file-sync';

import handler from 'utils/handler';
import flowFiles from 'utils/flowFiles';

export default (newOptions?: null | {} = null) => {
  // reset handler
  handler.initialized = false;
  handler.initialOptions = {
    verbose: false,
    watch: false,
  };
  handler.options = {
    ...handler.initialOptions,
    src: ['src'],
    outDir: 'lib',
    plugins: [],
  };

  // reset flowFiles
  flowFiles.store = [];
  flowFiles.watcher = null;

  // reinitialize options
  options.cliOptions = newOptions;
  handler.initializeOptions({ watch: false });

  // reset outputFileSync
  outputFileSync.destPaths = [];
};
