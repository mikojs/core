// @flow

import { keywordQuestion } from '../handlePackageJson';

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
    }: {
      name: string,
      value: string | $ReadOnlyArray<string>,
      expected: string | $ReadOnlyArray<string>,
    }) => {
      expect(keywordQuestion[name](value)).toEqual(expected);
    },
  );
});
