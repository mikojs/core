// @flow

import reset from './__ignore__/reset';
import babel from './__ignore__/babel';

test('can not use without @babel/cli', () => {
  expect(() => {
    reset({});
    babel();
  }).toThrowError(
    '@cat-org/babel-plugin-transform-flow only can be used with @babel/cli: Can not find `src` or `outDir`',
  );
});
