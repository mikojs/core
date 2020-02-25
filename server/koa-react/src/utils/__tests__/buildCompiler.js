// @flow

import webpack from 'webpack';
import webpackHotClient from 'webpack-hot-client';

import buildCompiler from '../buildCompiler';
import buildCache from '../buildCache';

describe('build compiler', () => {
  test('dev = true', async () => {
    const compiler = buildCompiler('/', {}, buildCache('/', {})).run();
    const { server } = webpackHotClient();

    expect(server.on).toHaveBeenCalledTimes(1);

    server.on.mock.calls[0][1]();

    expect(await compiler).toBeUndefined();
  });

  test('dev = false', async () => {
    const compiler = buildCompiler(
      '/',
      { dev: false },
      buildCache('/', {}),
    ).run();
    const { run } = webpack({});

    expect(run).toHaveBeenCalledTimes(1);

    // $FlowFixMe jest mock
    run.mock.calls[0][0]();

    expect(await compiler).toBeUndefined();
  });
});
