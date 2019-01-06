// @flow

import babel from './babel';
import prettier from './prettier';
import lint from './lint';
import lintsteged from './lintsteged';
import jest from './jest';

type configType = {
  alias?: string,
  install?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  config?: (argv: $ReadOnlyArray<mixed>) => mixed,
  ignore?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  ignoreName?: string,
  env?: {},
  configFiles?: {},
};

export default ({
  // babel
  babel,
  'babel:lerna': {
    ...babel,
    alias: 'babel',
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...babel.run(argv),
      '--config-file',
      '../../babel.config.js',
    ],
  },

  // prettier
  prettier,

  // eslint
  lint,
  'lint:watch': {
    ...lint,
    alias: 'esw',
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...lint.run(argv),
      '-w',
      '--rule',
      'prettier/prettier: off',
      '--quiet',
    ],
  },

  // lint-staged
  'lint-staged': lintsteged,

  // jest
  jest,
  test: {
    ...jest,
    alias: 'jest',
    run: (argv: $ReadOnlyArray<string>): $ReadOnlyArray<string> => [
      ...argv,
      '--silent',
    ],
  },
}: {
  [string]: configType & {
    run?: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  },
  babel: configType & {
    run: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  },
  lint: configType & {
    run: (argv: $ReadOnlyArray<string>) => $ReadOnlyArray<string>,
  },
});
