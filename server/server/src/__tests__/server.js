// @flow

import testServer from './__ignore__/testServer';
import fetchServer from './__ignore__/fetchServer';

describe('default server', () => {
  test.each`
    method    | expected
    ${'get'}  | ${['custom middleware', 'entry router', 'test', 'get']}
    ${'post'} | ${['custom middleware', 'entry router', 'test', 'post']}
    ${'put'}  | ${['custom middleware', 'entry router', 'test', 'put']}
    ${'del'}  | ${''}
  `(
    '$method',
    async ({
      method,
      expected,
    }: {
      method: string,
      expected: $ReadOnlyArray<string> | string,
    }) => {
      expect(await fetchServer(`/test/${method}`, method)).toEqual(expected);
    },
  );

  test('not find method', async () => {
    expect(await fetchServer('/')).toEqual(['custom middleware']);
  });

  test('default middlewares work', async () => {
    expect(
      await fetchServer('/bodyparser', 'post', {
        body: JSON.stringify({ key: 'value' }),
        headers: { 'Content-Type': 'application/json' },
      }),
    ).toEqual({
      key: 'value',
    });
  });

  afterAll(() => {
    testServer.close();
  });
});
