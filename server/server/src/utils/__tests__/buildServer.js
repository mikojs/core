// @flow

import Koa from 'koa';
import chokidar from 'chokidar';
import getPort from 'get-port';

import buildServer from '../buildServer';

describe('build server', () => {
  beforeEach(() => {
    chokidar.watch().on.mockClear();
  });

  test('watch with dev = true', async () => {
    const server = buildServer();
    const mockLog = jest.fn();
    const mockCallback = jest.fn();

    global.console.log = mockLog;

    const runningServer = await server.run(__dirname, {
      port: await getPort(),
    })(new Koa());

    server.on('add', mockCallback);

    const [[, chokidarCallback]] = chokidar.watch().on.mock.calls;

    expect(mockLog).toHaveBeenCalledTimes(1);

    chokidarCallback('add', 'test.js');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('test.js');

    chokidarCallback('remove', 'test.js');

    expect(mockCallback).toHaveBeenCalledTimes(1);

    chokidarCallback('add', 'test');

    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledWith('test');

    runningServer.close();
  });

  test('watch with dev = false', async () => {
    (
      await buildServer().run(__dirname, { dev: false, port: await getPort() })(
        new Koa(),
      )
    ).close();

    expect(chokidar.watch().on).not.toHaveBeenCalled();
  });
});
