/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { chokidar } from 'chokidar';

import server from '../index';

import testServer from './__ignore__/testServer';
import fetchServer from './__ignore__/fetchServer';

import Endpoint from 'utils/Endpoint';

let runningServer: http$Server;

describe('server', () => {
  test.each`
    method
    ${'get'}
    ${'post'}
    ${'put'}
    ${'del'}
    ${'all'}
  `(
    '`server.$method` is not under `server.start',
    async ({ method }: {| method: string |}) => {
      await expect(
        (async () =>
          (await server.init()) |> ('/test' |> server[method] |> server.end))(),
      ).rejects.toThrow(`\`server.${method}\` is not under \`server.start\``);
    },
  );

  test('can not find `test` method in `koa-router`', async () => {
    await expect(
      (async () =>
        (await server.init())
        |> (undefined
          |> server.start
          |> (new Endpoint('/test', 'test') |> server.end)
          |> server.end))(),
    ).rejects.toThrow('can not find `test` method in `koa-router`');
  });

  test('server.watch work', async () => {
    const mockRouter = jest.fn();

    expect(server.watch('dir', [])(mockRouter)).toEqual(mockRouter);

    require.cache['test.js'] = true;
    chokidar.watchCallback('add', 'test.js');
    chokidar.watchCallback('delete', 'test.js');
    chokidar.watchCallback('add', 'test');
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
