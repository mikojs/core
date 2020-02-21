// @flow

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

    const runningServer = await server.run(
      server.init({
        dir: __dirname,
        port: await getPort(),
      }),
    );

    server.on('watch:add', mockCallback);

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
    const server = buildServer();

    (
      await server.run(server.init({ dev: false, port: await getPort() }))
    ).close();

    expect(chokidar.watch().on).not.toHaveBeenCalled();
  });
});
