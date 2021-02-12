// @flow

import testings, { type testingType } from './__ignore__/testings';

describe('eslint config base', () => {
  test.each(testings)(
    '%s',
    (
      name: $ElementType<testingType, 0>,
      filePath: $ElementType<testingType, 1>,
      rules: $ElementType<testingType, 2>,
    ) => {
      const { log } = console;

      log(name, filePath, rules);
    },
  );
});
