// @flow

import type { cliType, cliFuncType } from './definitions/cli.js.flow';

test('can not use without @babel/cli', () => {
  jest.mock(
    '@babel/cli/lib/babel/options',
    (): cliFuncType => (): cliType => ({
      cliOptions: {},
    }),
  );

  expect(require('./__ignore__/babel').default).toThrowError(
    '@cat-org/babel-plugin-transform-flow only can be used with @babel/cli: Can not find `src` or `outDir`',
  );
});
