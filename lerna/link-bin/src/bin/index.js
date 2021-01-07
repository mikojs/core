#! /usr/bin/env node
// @flow

import { getPackagesSync } from '@lerna/project';
import symlinkBinary from '@lerna/symlink-binary';

(() => {
  getPackagesSync().forEach((pkg: {| rootPath: string |}) => {
    symlinkBinary(pkg, pkg.rootPath);
  });
})();
