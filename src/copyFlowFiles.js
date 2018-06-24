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

d3DirTree(path.resolve(__dirname, './../packages')).children.forEach(
  ({ data: folderData }: d3DirTree) => {
    const { path: folderPath, name: packageName } = folderData;
    let countFiles: number = 0;

    d3DirTree(path.resolve(folderPath, './src')).each(({ data }: d3DirTree) => {
      const { path: filePath, extension } = data;

      if (extension !== '.flow') return;

      countFiles += 1;
      fs.copy(
        filePath,
        filePath.replace(`${folderPath}/src/`, `${folderPath}/lib/`),
      );
    });

    if (countFiles === 0) return;

    fs.commit(
      (err: mixed): void =>
        showInfo(
          !err,
          packageName,
          chalk`copy {gray (${countFiles})} flow files`,
        ),
    );
  },
);
