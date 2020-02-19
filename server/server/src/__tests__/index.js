/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import chokidar from 'chokidar';

import server from '../index';

import testServer from './__ignore__/testServer';
import fetchServer from './__ignore__/fetchServer';

let runningServer: http$Server;

describe('server', () => {
  test('server.watch work', async () => {
    const mockRouter = jest.fn();

    expect(server.watch('dir', [])(mockRouter)).toEqual(mockRouter);

    require.cache['test.js'] = true;
    chokidar.watch().on.mock.calls[0][1]('add', 'test.js');
    chokidar.watch().on.mock.calls[0][1]('delete', 'test.js');
    chokidar.watch().on.mock.calls[0][1]('add', 'test');
  });

  describe('running server', () => {
    beforeAll(async () => {
      runningServer = await testServer();
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
        expect(
          await fetchServer(
            `/test/${method}`,
            method === 'all' ? 'get' : method,
          ),
        ).toEqual(expected);
      },
    );

    test('not find method', async () => {
      expect(await fetchServer('/')).toEqual(['entry router']);
    });

    afterAll(() => {
      runningServer.close();
    });
  });
});
