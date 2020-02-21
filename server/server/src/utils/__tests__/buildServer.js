// @flow

import chokidar from 'chokidar';
import getPort from 'get-port';

import buildServer from '../buildServer';

describe('build server', () => {
  beforeEach(() => {
    chokidar.watch().on.mockClear();
  });

  test('run server with build = true', async () => {
    const server = buildServer();
    const mockLog = jest.fn();
    const mockCallback = jest.fn();

    global.console.log = mockLog;
    server.on('build', mockCallback);
    (
      await server.run(
        server.init({
          dev: false,
          build: true,
          port: await getPort(),
        }),
      )
    ).close();

    expect(mockLog).toHaveBeenCalledTimes(2);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test('watch with dev = true', async () => {
    const server = buildServer();
    const mockCallback = jest.fn();

    server.on('watch:add', mockCallback);
    (
      await server.run(
        server.init({
          dir: __dirname,
          port: await getPort(),
        }),
      )
    ).close();

    const [[, chokidarCallback]] = chokidar.watch().on.mock.calls;

    await chokidarCallback('add', 'test.js');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({ filePath: 'test.js' }),
    );

    await chokidarCallback('remove', 'test.js');

    expect(mockCallback).toHaveBeenCalledTimes(1);

    await chokidarCallback('change', 'test');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).not.toHaveBeenCalledWith(
      expect.objectContaining({ filePath: 'test' }),
    );
  });

  test('watch with dev = false', async () => {
    const server = buildServer();

    (
      await server.run(server.init({ dev: false, port: await getPort() }))
    ).close();

    expect(chokidar.watch().on).not.toHaveBeenCalled();
  });
});
