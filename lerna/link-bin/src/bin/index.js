#! /usr/bin/env node
// @flow

import { getPackagesSync } from '@lerna/project';
import symlinkBinary from '@lerna/symlink-binary';

import { handleUnhandledRejection } from '@mikojs/utils';
import commander from '@mikojs/commander';

import { version } from '../../package.json';

handleUnhandledRejection();

const parseArgv = commander<[]>({
  name: 'lerna-link-bin',
  version,
  description: 'Link bin files in the monorepo.',
});

(async () => {
  await parseArgv(process.argv);
  getPackagesSync().forEach((pkg: {| rootPath: string |}) => {
    symlinkBinary(pkg, pkg.rootPath);
  });
})();
