// @flow

import path from 'path';

const CONFIG_FILE = path.resolve(__dirname, '../index.js');

export const CLI_MODULES = {
  babel: ['babel-cli', '@babel/cli'],
};

export const CLI_CONFIG = {
  babel: ['--config-file', CONFIG_FILE],
  prettier: ['--config', CONFIG_FILE],
  'lint-staged': ['-c', CONFIG_FILE],
  jest: [`--config=${CONFIG_FILE}`],
};
