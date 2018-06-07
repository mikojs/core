// @flow

import path from 'path';

import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';

import findPackages from './findPackages';
import showInfo from './showInfo';

import pkg from '../package.json';

const store = memFs.create();
const fs = editor.create(store);

const flowVersion = pkg
  .devDependencies['flow-bin']
  .replace(/\^/, '');

findPackages
  .forEach((packageName: string) => {
    const packagePkgPath = path.resolve(
      __dirname,
      './../packages',
      packageName,
      'package.json'
    );

    fs.extendJSON(packagePkgPath, {
      scripts: {
        'flow-typed': `flow-typed install -f ${flowVersion} --verbose`
      },
    });

    fs.commit(err => showInfo(!err, packageName, 'add scripts'));
  });
