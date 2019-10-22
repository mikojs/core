// @flow

import getPort from 'get-port';

import server from '../server';

jest.mock(
  '@mikojs/koa-graphql',
  () =>
    class MockGraphql {
      relay = jest.fn();
      middleware = () => async (ctx: mixed, next: () => Promise<void>) => {
        await next();
      };
    },
);

describe('server', () => {
  test.each`
    dev      | watch    | NODE_ENV         | SKIP_SERVER
    ${true}  | ${true}  | ${'development'} | ${true}
    ${true}  | ${false} | ${'development'} | ${false}
    ${false} | ${true}  | ${'test'}        | ${true}
    ${false} | ${false} | ${'test'}        | ${false}
    ${true}  | ${true}  | ${'test'}        | ${false}
  `(
    'Running server with dev = $dev, watch = $watch, NODE_ENV = $NODE_ENV, SKIP_SERVER = $SKIP_SERVER',
    async ({
      dev,
      watch,
      NODE_ENV,
      SKIP_SERVER,
    }: {|
      dev: boolean,
      watch: boolean,
      NODE_ENV: string,
      SKIP_SERVER: boolean,
    |}) => {
      process.env.NODE_ENV = NODE_ENV;

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

      (!SKIP_SERVER || NODE_ENV === 'test'
        ? expect(runningServer).not
        : expect(runningServer)
      ).toBeNull();

      if (!SKIP_SERVER || NODE_ENV == 'test') runningServer.close();
    },
  );
});
