// @flow

import buildCache from '../buildCache';

describe('build cache', () => {
  test.each`
    info             | exists   | expected
    ${'add a.js'}    | ${true}  | ${`[requireModule(path.resolve(__filename, 'a.js'))]`}
    ${'remove a.js'} | ${false} | ${'[]'}
  `(
    '$info',
    ({ exists, expected }: {| exists: boolean, expected: string |}) => {
      expect(
        buildCache({
          exists,
          filePath: 'a.js',
          pathname: '/a',
        }),
      ).toMatch(expected);
    },
  );
});
