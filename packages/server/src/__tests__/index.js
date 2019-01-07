/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import server from '..';

import Endpoint from 'utils/Endpoint';

describe('server', () => {
  test.each`
    method
    ${'get'}
    ${'post'}
    ${'put'}
    ${'del'}
  `(
    '`server.$method` is not under `server.all`',
    ({ method }: { method: string }) => {
      expect(
        () => server.init() |> ('/test' |> server[method] |> server.end),
      ).toThrow(`\`server.${method}\` is not under \`server.all\``);
    },
  );

  it('can not find `test` method in `koa-router`', () => {
    expect(
      () =>
        server.init()
        |> (undefined
          |> server.all
          |> (new Endpoint('/test', 'test') |> server.end)
          |> server.end),
    ).toThrow('can not find `test` method in `koa-router`');
  });
});
