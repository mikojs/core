// @flow

import commander, { type optionType } from '../index';
import testings from './__ignore__/testings';

describe('commander', () => {
  test.each(testings)(
    'configs = %j, argv = %j',
    async (
      configs: optionType,
      argv: $ReadOnlyArray<string>,
      expected: mixed,
    ) => {
      expect(
        (await commander(configs)(['node', 'commander', ...argv])).slice(0, -1),
      ).toEqual(expected);
    },
  );
});
