// @flow

import getPort from 'get-port';

import buildServer from '../buildServer';

describe('build server', () => {
  test('run server with build = true', async () => {
    const server = buildServer();
    const mockCallback = jest.fn();

    server.on('build', mockCallback);
    (
      await server.run(
        await server.init({
          dev: false,
          build: true,
          port: await getPort(),
        }),
      )
    ).close();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  test.each`
    dev
    ${true}
    ${false}
  `('run server with dev = $dev', async ({ dev }: {| dev: boolean |}) => {
    const server = buildServer();
    const mockCallback = jest.fn();

    server.on(['watch'], mockCallback);
    (
      await server.run(
        await server.init({
          dev,
          port: await getPort(),
        }),
      )
    ).close();

    (dev ? expect(mockCallback) : expect(mockCallback).not).toHaveBeenCalled();
  });
});
