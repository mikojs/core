// @flow

import path from 'path';

export default {
  alias: () => path.resolve(__dirname, '../bin/exec'),
  install: (install: $ReadOnlyArray<string>) => [
    ...install,
    'flow-bin',
    'flow-typed',
    'husky',
    'standard-version',
  ],
  config: () => ({
    // flow-typed
    'flow-typed': {
      install: ['flow-typed', 'install', '--verbose'],
    },

    // husky
    husky: {
      'pre-commit': [
        'configs',
        'babel',
        '&&',
        'configs',
        'lint-staged',
        '&&',
        'flow',
      ],

      'post-merge': ['configs', 'babel'],

      'post-checkout': ['configs', 'babel'],
    },

    // release
    release: ['standard-version'],
  }),
  configsFiles: {
    exec: '.execrc.js',
  },
};
