// @flow

import { emptyFunction } from 'fbjs';

type returnType = {|
  command: (argv: $ReadOnlyArray<string>) => void,
  build: () => Promise<void>,
  watch: () => Promise<void>,
|};

/**
 * @example
 * buildBabel()
 *
 * @return {returnType} - babel functions
 */
export default (): returnType => {
  const cache = {
    fn: emptyFunction,
    opts: {},
  };

  return {
    command: (argv: $ReadOnlyArray<string>) => {
      cache.opts = require('@babel/cli/lib/babel/options')([
        'node',
        'babel',
        argv,
      ]);
      cache.fn = cache.opts.cliOptions.outDir
        ? require('@babel/cli/lib/babel/dir')
        : require('@babel/cli/lib/babel/file');
    },
    build: () =>
      cache.fn({
        ...cache.opts,
        cliOptions: {
          ...cache.opts.cliOptions,
          watch: false,
          skipInitialBuild: false,
        },
      }),
    watch: () =>
      cache.fn({
        ...cache.opts,
        cliOptions: {
          ...cache.opts.cliOptions,
          watch: true,
          skipInitialBuild: true,
        },
      }),
  };
};
