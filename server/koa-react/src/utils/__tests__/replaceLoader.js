// @flow

import replaceLoader from '../replaceLoader';

import testings from './__ignore__/testings';

describe('replace loader', () => {
  test.each(testings)(
    'run with type = %s and source = %s',
    (type: string, source: string, cacheDir?: string, expected: string) => {
      expect(replaceLoader.bind({ query: { type, cacheDir } })(source)).toBe(
        expected,
      );
    },
  );

  test('replace type error', () => {
    expect(() => {
      replaceLoader.bind({ query: '' })('test');
    }).toThrow('Replace type error');
  });

  test('not replace anything', () => {
    expect(() => {
      replaceLoader.bind({ query: { type: 'react-hot-loader' } })('test');
    }).toThrow('Replace failed: react-hot-loader');
  });
});
