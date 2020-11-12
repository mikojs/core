// @flow

import commander from '../index';
import testings, { type testingType } from './__ignore__/testings';

describe('commander', () => {
  test.each(testings)(
    'configs = %j, argv = %j',
    async (
      configs: $ElementType<testingType, 0>,
      argv: $ElementType<testingType, 1>,
      expected: $ElementType<testingType, 2>,
    ) => {
      const result = await commander(configs)(['node', 'commander', ...argv]);

      expect(result.slice(-1)[0]).toMatchObject(expected.slice(-1)[0]);
      expect(result.slice(0, -1)).toEqual(expected.slice(0, -1));
    },
  );
});
