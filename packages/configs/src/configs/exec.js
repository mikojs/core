// @flow

import path from 'path';

export default {
  alias: () => path.resolve(__dirname, '../bin/exec'),
  install: (install: $ReadOnlyArray<string>) => [...install, 'flow-typed'],
  config: () => ({
    'flow-typed': {
      install: ['flow-typed', 'install', '--verbose'],
    },
  }),
  configsFiles: {
    exec: '.execrc.js',
  },
};
