// @flow

import path from 'path';

import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';

import pkg from '../package.json';

import showInfo from './showInfo';

const store = memFs.create();
const fs = editor.create(store);
const totalDependencies = {};

delete pkg.dependencies;

fs.writeJSON(path.resolve(__dirname, '../package.json'), pkg);
fs.commit(
  (err: mixed): void => showInfo(!err, 'test-packages', 'reset dependencies'),
);

const MODULES = ['eslint-config-cat'];

MODULES.forEach((moduleName: string) => {
  const { dependencies } = require(path.resolve(
    __dirname,
    '../packages',
    moduleName,
    'package.json',
  ));

  Object.keys(dependencies).forEach((dependencyName: string) => {
    const dependencyVersion = dependencies[dependencyName].replace(/^\^/, '');

    if (totalDependencies[dependencyName]) {
      totalDependencies[dependencyName].push(dependencyVersion);
    } else {
      totalDependencies[dependencyName] = [dependencyVersion];
    }
  });

  fs.extendJSON(path.resolve(__dirname, '../package.json'), { dependencies });
});

let hasError: boolean = false;
Object.keys(totalDependencies).forEach((dependencyName: string) => {
  if (totalDependencies[dependencyName].length > 1) {
    hasError = true;
    showInfo(
      false,
      'test-packages',
      // eslint-disable-next-line max-len
      chalk`{blueBright ${dependencyName}} has multiple versions: {red ${totalDependencies[
        dependencyName
      ].join(', ')}}`,
    );
  }
});

if (!hasError) {
  fs.commit(
    (err: mixed): void => showInfo(!err, 'test-packages', 'write dependencies'),
  );
}
