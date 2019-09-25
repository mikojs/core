// @flow

import { type configsType } from '../types';

import exec from './exec';
import babel from './babel';
import prettier from './prettier';
import lint from './lint';
import lintsteged from './lintsteged';
import jest from './jest';
import server from './server';
import flowTypedLerna from './flow-typed-lerna';

export default ({
  // custom command
  exec,

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
  lint,
  'lint:watch': {
    ...lint,
    alias: 'esw',
    run: (argv: $ReadOnlyArray<string>) => [
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
    run: (argv: $ReadOnlyArray<string>) => [...argv, '--silent'],
  },

  // lerna flow-typed install
  'flow-typed:lerna': flowTypedLerna,

  // @mikojs/server
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
}: configsType);
