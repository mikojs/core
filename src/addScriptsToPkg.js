// @flow

import path from 'path';

import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';

import findPackages from './findPackages';
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

    fs.commit((err) => {
      if (err) console.log(chalk`{bgRed  ${packageName} } add scripts {cyan fail}`);
      else console.log(chalk`{bgGreen  ${packageName} } add scripts {cyan done}`);
    });
  });
