#!/usr/bin/env node
// @flow

import path from 'path';

import memFs from 'mem-fs';
import editor from 'mem-fs-editor';

import pkg from '../../package.json';

import showInfo from '../showInfo';

import findPackages from './findPackages';

const store = memFs.create();
const fs = editor.create(store);

const flowVersion = pkg.devDependencies['flow-bin'].replace(/\^/, '');

findPackages.forEach((packageName: string) => {
  const packagePkgPath = path.resolve(
    __dirname,
    '../../packages',
    packageName,
    'package.json',
  );

  fs.writeJSON(packagePkgPath, {
    ...require(packagePkgPath),
    scripts: {
      'flow-typed': `flow-typed install -f ${flowVersion} --verbose`,
    },
  });

  fs.commit(
    (err: mixed): void => showInfo(!err, packageName, 'modify package.json'),
  );
});
