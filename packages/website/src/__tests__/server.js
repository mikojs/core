// @flow

import getPort from 'get-port';

import server from '../server';

jest.mock('@mikojs/koa-graphql', () =>
  jest.fn().mockReturnValue({
    runRelayCompiler: jest.fn(),
    middleware: jest
      .fn()
      .mockReturnValue(async (ctx: mixed, next: () => Promise<void>) => {
        await next();
      }),
  }),
);

jest.mock(
  '@mikojs/koa-react',
  () =>
    class MockReact {
      middleware = () => async (ctx: mixed, next: () => Promise<void>) => {
        await next();
      };
    },
);

describe('server', () => {
  test.each`
    dev      | watch    | SKIP_SERVER
    ${true}  | ${true}  | ${false}
    ${true}  | ${false} | ${true}
    ${false} | ${true}  | ${false}
    ${false} | ${false} | ${true}
  `(
    'Running server with dev = $dev, watch = $watch, SKIP_SERVER = $SKIP_SERVER',
    async ({
      dev,
      watch,
      SKIP_SERVER,
    }: {|
      dev: boolean,
      watch: boolean,
      SKIP_SERVER: boolean,
    |}) => {
      if (SKIP_SERVER) process.env.SKIP_SERVER = SKIP_SERVER.toString();
      else delete process.env.SKIP_SERVER;

      const runningServer = await server({
        src: __dirname,
        dir: __dirname,
        dev,
        watch,
        port: await getPort(),
        restart: jest.fn(),
        close: jest.fn(),
      });

      (!SKIP_SERVER
        ? expect(runningServer).not
        : expect(runningServer)
      ).toBeNull();

      if (!SKIP_SERVER) runningServer.close();
    },
  );
});
