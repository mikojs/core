// @flow

import { d3DirTree } from '@cat-org/utils';

import cliOptions from './cliOptions';

export default d3DirTree(cliOptions.projectDir, {
  exclude: [
    /node_modules/,
    /.git/,
    /.*.log/,
    /lib/,
    /flow-typed\/npm/,
    /patches/,
    /package-lock.json/,
    /yarn.lock/,
  ],
});
