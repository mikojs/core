// @flow

import { type configType } from '../types';

import babel from './babel';
import prettier from './prettier';
import eslint from './eslint';
import lintsteged from './lintsteged';
import jest from './jest';
import server from './server';

export default ({
  // babel
  babel,
  'babel:lerna': {
    ...babel,
    alias: 'babel',
    run: (argv: $ReadOnlyArray<string>) => [
      ...babel.run(argv),
      '--config-file',
      '../../babel.config.js',
    ],
  },

  // prettier
  prettier,

  // eslint
  lint: eslint,
  'lint:watch': {
    ...eslint,
    alias: 'esw',
    run: (argv: $ReadOnlyArray<string>) => [
      ...eslint.run(argv),
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
    run: (argv: $ReadOnlyArray<string>) => [...argv, '--silent'],
  },

  // @cat-org/server
  server,
  'server:lerna': {
    ...server,
    alias: 'server',
    run: (argv: $ReadOnlyArray<string>) => [
      ...server.run(argv),
      '--config-file',
      '../../babel.config.js',
    ],
  },
}: {
  [string]: configType,
});
