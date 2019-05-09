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
  babelOptions: 'src -d lib --verbose',
};

describe('server', () => {
  test.each`
    method
    ${'get'}
    ${'post'}
    ${'put'}
    ${'del'}
  `(
    '`server.$method` is not under `server.all`',
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
          |> server.all
          |> (new Endpoint('/test', 'test') |> server.end)
          |> server.end))(),
    ).rejects.toThrow('process exit');
  });

  test('not use koa to run server', () => {
    expect(() => {
      server.run()();
    }).toThrow('process exit');
  });

  test('use dev mode', async () => {
    const runningServer =
      (await server.init({ ...context, dev: true })) |> server.run();

    await new Promise(resolve => setTimeout(resolve, 100));

    require.cache['test.js'] = true;
    chokidar.watchCallback('test.js');
    chokidar.watchCallback('test');
    runningServer.close();
  });
});
