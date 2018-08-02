// @flow

import type { cliType } from './definitions/cli.js.flow';

test('parse error', () => {
  jest.mock(
    '@babel/cli/lib/babel/options',
    (): cliType => ({
      cliOptions: {},
    }),
  );

  expect(require('./__ignore__/babel').default).toThrowError(
    '@cat-org/babel-plugin-transform-flow TypeError',
  );
});
