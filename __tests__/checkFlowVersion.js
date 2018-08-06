// @flow

import fs from 'fs';
import path from 'path';

import { devDependencies } from '../package.json';

const flowVersion = devDependencies['flow-bin'].replace(/\^/, '');

it('check flow version', () => {
  expect(
    fs.readFileSync(path.resolve(__dirname, '../Makefile'), {
      encoding: 'utf-8',
    }),
  ).toMatch(new RegExp(`flow-typed install -f ${flowVersion} --verbose`));
});
