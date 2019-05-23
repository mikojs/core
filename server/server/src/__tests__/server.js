// @flow

import testServer from './__ignore__/testServer';
import fetchServer from './__ignore__/fetchServer';

let server: http$Server;

describe('default server', () => {
  beforeAll(async () => {
    server = await testServer();
  });

  test.each`
    method    | expected
    ${'get'}  | ${['entry router', 'test', 'get']}
    ${'post'} | ${['entry router', 'test', 'post']}
    ${'put'}  | ${['entry router', 'test', 'put']}
    ${'del'}  | ${''}
    ${'all'}  | ${['entry router', 'test', 'all']}
  `(
    '$method',
    async ({
      method,
      expected,
    }: {|
      method: string,
      expected: $ReadOnlyArray<string> | string,
    |}) => {
      expect(await fetchServer(`/test/${method}`, method)).toEqual(expected);
    },
  );

  test('not find method', async () => {
    expect(await fetchServer('/')).toEqual(['entry router']);
  });

  afterAll(() => {
    server.close();
  });
});
