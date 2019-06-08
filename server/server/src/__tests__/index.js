/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
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
  test('event work', async () => {
    const mockCallback = jest.fn();
    const runningServer = await ((await server.init(context))
      |> (await server.event(mockCallback))
      |> server.run);

    runningServer.close();

    expect(mockCallback).toHaveBeenCalled();
  });

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
      ).rejects.toThrow('process exit');
    },
  );

  test('can not find `test` method in `koa-router`', async () => {
    await expect(
      (async () =>
        (await server.init(context))
        |> (undefined
          |> server.start
          |> (new Endpoint('/test', 'test') |> server.end)
          |> server.end))(),
    ).rejects.toThrow('process exit');
  });

  test('use dev mode', async () => {
    const runningServer = await ((await server.init({
      ...context,
      dev: true,
      babelOptions: 'src -d lib --verbose',
    })) |> server.run);

    await new Promise(resolve => setTimeout(resolve, 100));

    require.cache['test.js'] = true;
    chokidar.watchCallback('test.js');
    chokidar.watchCallback('test');
    runningServer.close();
  });
});
