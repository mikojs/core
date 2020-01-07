// @flow

import path from 'path';

export default {
  alias: () => path.resolve(__dirname, '../bin/exec.js'),
  configsFiles: {
    exec: 'exec.config.js',
  },
};
