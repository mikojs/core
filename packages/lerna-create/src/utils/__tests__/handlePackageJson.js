// @flow

import { inquirer } from 'inquirer';

import handlePackageJson, { keywordQuestion } from '../handlePackageJson';

import pkg from '../../../package.json';

test('handle package.json', async () => {
  const result = {
    name: 'name',
    description: 'description',
    homepage: 'homepage',
    repository: 'repository',
    keywords: ['keywords'],
  };

  const expected = {
    ...pkg,
    ...result,
  };

  delete expected.bin;
  delete expected.dependencies;
  delete expected.devDependencies;

  inquirer.result = result;

  expect(
    JSON.parse(await handlePackageJson(pkg, (text: string) => text)),
  ).toEqual(expected);
});

describe('keyword question', () => {
  test.each`
    name          | value | expected
    ${'filter'}   | ${''} | ${[]}
    ${'validate'} | ${[]} | ${'can not be empty'}
  `(
    'test $name',
    ({
      name,
      value,
      expected,
    }: {|
      name: string,
      value: string | $ReadOnlyArray<string>,
      expected: string | $ReadOnlyArray<string>,
    |}) => {
      expect(keywordQuestion[name](value)).toEqual(expected);
    },
  );
});
