// @flow

import fs from 'fs';
import path from 'path';

import pkg from '../package.json';

const flowVersion = pkg.devDependencies['flow-bin'].replace(/\^/, '');

it('check flow version', () => {
  expect(
    fs.readFileSync(path.resolve(__dirname, '../Makefile'), {
      encoding: 'utf-8',
    }),
  ).toMatch(new RegExp(`flow-typed install -f ${flowVersion} --verbose`));
});
