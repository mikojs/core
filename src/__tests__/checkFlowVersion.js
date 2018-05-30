// @flow

import path from 'path';

import findPackages from './../findPackages';
import pkg from './../../package.json';

const flowVersion = pkg
  .devDependencies['flow-bin']
  .replace(/\^/, '');

describe('check flow version', () => {
  findPackages
    .forEach((packageName: string) => {
      it(packageName, () => {
        const packagePkgPath = path.resolve(
          __dirname,
          './../../packages',
          packageName,
          'package.json'
        );

        const packagePkg = require(packagePkgPath);

        expect(packagePkg.scripts['flow-typed'])
          .toBe(`flow-typed install -f ${flowVersion} --verbose`);
      });
    });
});
