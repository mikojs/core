// @flow
// FIXME: https://github.com/facebook/flow/issues/5519

import path from 'path';

import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';

import d3DirTree from '../packages/utils/lib/d3DirTree';
// eslint-disable-next-line max-len
import type { d3DirTreeType } from '../packages/utils/src/definitions/d3DirTree.js.flow';

import showInfo from './showInfo';

const store = memFs.create();
const fs = editor.create(store);
const packageNames = {};

// TODO can copy with argu
d3DirTree(path.resolve(__dirname, './../packages')).each(
  ({ data }: d3DirTreeType) => {
    const { path: filePath, extension } = data;

    if (extension !== '.flow' || /(node_modules)|(lib)/.test(filePath)) return;

    const packageName = filePath
      .replace(`${path.resolve(__dirname, './../packages')}/`, '')
      .replace(/\/src\/.*/, '');

    packageNames[packageName] = (packageNames[packageName] || 0) + 1;

    fs.copy(
      filePath,
      filePath.replace(/packages\/([a-zA-Z-]*)\/src/, 'packages/$1/lib'),
    );
  },
);

if (Object.keys(packageNames).length !== 0) {
  fs.commit(
    (err: mixed): void =>
      Object.keys(packageNames).forEach((packageName: string) => {
        showInfo(
          !err,
          packageName,
          chalk`copy {gray (${packageNames[packageName]})} flow files`,
        );
      }),
  );
}
