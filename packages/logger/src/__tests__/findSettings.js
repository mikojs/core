// @flow

import findSettings from '../findSettings';

import logSettings from '../settings/log';

/**
 * Wait flow-typed fix
 * https://github.com/flow-typed/flow-typed/pull/2840
 *
 * $FlowFixMe
 */
describe.each`
  name     | expected
  ${'log'} | ${logSettings}
  ${'aaa'} | ${null}
`('find settings', ({ name, expected }: { name: string, expected: ?{} }) => {
  it(`find ${name}`, () => {
    expect(findSettings(name)).toBe(expected);
  });
});
