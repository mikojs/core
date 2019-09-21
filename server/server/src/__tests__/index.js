/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { chokidar } from 'chokidar';

import server from '../index';

import Endpoint from 'utils/Endpoint';

const context = {
  dev: false,
  dir: 'lib',
  babelOptions: false,
};

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
          (await server.init(context))
          |> ('/test' |> server[method] |> server.end))(),
      ).rejects.toThrow(`\`server.${method}\` is not under \`server.start\``);
    },
  );

  test('server.watch work', async () => {
    const mockRouter = jest.fn();

    expect(server.watch('dir', [])(mockRouter)).toEqual(mockRouter);

    require.cache['test.js'] = true;
    chokidar.watchCallback('add', 'test.js');
    chokidar.watchCallback('delete', 'test.js');
    chokidar.watchCallback('add', 'test');
  });

  test('can not find `test` method in `koa-router`', async () => {
    await expect(
      (async () =>
        (await server.init(context))
        |> (undefined
          |> server.start
          |> (new Endpoint('/test', 'test') |> server.end)
          |> server.end))(),
    ).rejects.toThrow('can not find `test` method in `koa-router`');
  });
});
