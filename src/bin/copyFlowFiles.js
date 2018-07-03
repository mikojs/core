#!/usr/bin/env node
// @flow

import nodeFs from 'fs';
import path from 'path';

import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';

import d3DirTree from '../../packages/utils/lib/d3DirTree';
// eslint-disable-next-line max-len
import type { d3DirTreeType } from '../../packages/utils/src/definitions/d3DirTree.js.flow';

import showInfo from '../showInfo';

const store = memFs.create();
const fs = editor.create(store);

const { moduleName } = commandLineArgs([
  {
    name: 'moduleName',
    alias: 'p',
    type: String,
    defaultOption: true,
  },
]);

if (!moduleName) {
  showInfo(false, 'copy flow files', 'module name can no be empty');
  process.exit();
}

const root = path.resolve(__dirname, '../../packages', moduleName);

if (!nodeFs.existsSync(root)) {
  showInfo(
    false,
    'copy flow files',
    chalk`can not find {red ${moduleName}} in packages`,
  );
  process.exit();
}

let countFiles: number = 0;

d3DirTree(root, {
  extensions: /\.flow$/,
  exclude: [/node_modules/, /lib/],
}).each(({ data }: d3DirTreeType) => {
  const { path: filePath, type } = data;

  if (type === 'directory') return;

  const fileRelativePath = filePath.replace(root, '.');

  countFiles += 1;
  fs.copy(filePath, path.resolve(root, fileRelativePath.replace(/src/, 'lib')));
});

fs.commit(
  (err: mixed): void =>
    showInfo(!err, moduleName, chalk`copy {gray (${countFiles})} flow files`),
);
