// @flow

import path from 'path';

import memFs from 'mem-fs';
import editor from 'mem-fs-editor';

import pkg from '../package.json';

import findPackages from './findPackages';
import showInfo from './showInfo';

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
        'flow-typed': `flow-typed install -f ${flowVersion} --verbose`,
      },
    });

    fs.commit((err: mixed): void => showInfo(!err, packageName, 'add scripts'));
  });
