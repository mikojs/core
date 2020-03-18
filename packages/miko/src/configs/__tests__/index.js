// @flow

import getConfigs from '../index';

import testings, { mockFunc, originalConfigs } from './__ignore__/testings';

const configs = getConfigs(originalConfigs);

describe('get configs', () => {
  beforeEach(() => {
    mockFunc.mockClear();
  });

  test('check key', () => {
    const expected = testings.map(
      (testing: $ElementType<typeof testings, number>) => testing[0],
    );

    expect(Object.keys(configs)).toEqual(expected);
    expect(Object.keys(getConfigs([originalConfigs, originalConfigs]))).toEqual(
      expected,
    );
  });

  test.each(testings)('run command %s', (key: string, expected: number) => {
    configs[key][0]([]);

    expect(mockFunc).toHaveBeenCalledTimes(expected);
  });
});
