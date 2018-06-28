// @flow
// FIXME: https://github.com/facebook/flow/issues/5519

import path from 'path';

import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';

import d3DirTree from '../packages/utils/lib/d3DirTree';

import showInfo from './showInfo';

const store = memFs.create();
const fs = editor.create(store);
const packageNames = {};

d3DirTree(path.resolve(__dirname, './../packages')).each(
  ({ data }: d3DirTree) => {
    const { path: filePath, extension } = data;

    if (extension !== '.flow' || /node_modules/.test(filePath)) return;

    const packageName = filePath
      .replace(`${path.resolve(__dirname, './../packages')}/`, '')
      .replace(/\/src\/.*/, '');

    packageNames[packageName] = (packageNames?.[packageName] || 0) + 1;

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
