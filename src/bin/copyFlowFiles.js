#!/usr/bin/env node
// @flow

import nodeFs from 'fs';
import path from 'path';

import { d3DirTree } from '@cat-org/utils';
import type { d3DirTreeNodeType } from '@cat-org/utils/lib/d3DirTree';

import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';
import commandLineArgs from 'command-line-args';

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
}).each(
  ({ data: { name: fileName, path: filePath, type } }: d3DirTreeNodeType) => {
    if (type === 'directory') return;

    const fileRelativePath = filePath.replace(root, '.');

    if (!/src\/definitions/.test(fileRelativePath)) {
      showInfo(
        false,
        moduleName,
        chalk`flow definitions must be in {blueBright ${moduleName}/src/definitions}, but find {red ${fileRelativePath.replace(
          /\./,
          moduleName,
        )}}`,
      );
      return;
    }

    const content = fs
      .read(filePath)
      .replace(/\/\/ @flow\n\n/, '')
      .split(/\n/)
      .map(
        (text: string): string =>
          text === '' ? '' : `  ${text.replace(/export/g, 'declare')}`,
      )
      .join('\n');
    const moduleFlowName = fileName.replace(/\.js\.flow/, '');

    countFiles += 1;
    fs.write(
      path.resolve(
        root,
        fileRelativePath
          .replace(/src\/definitions/, 'lib/flow-typed')
          .replace(/\.js\.flow/, '.js'),
      ),
      `/**
 * Build files by @cat-org
 */
declare module "@cat-org/${moduleName}${
        moduleFlowName === 'index' ? '' : `/lib/${moduleFlowName}`
      }" {
${content}
  declare module.exports: ${
    moduleFlowName === 'index' ? moduleName : moduleFlowName
  }Type;
}`,
      /* eslint-enable indent */
    );
  },
);

fs.commit(
  (err: mixed): void =>
    showInfo(!err, moduleName, chalk`copy {gray (${countFiles})} flow files`),
);
