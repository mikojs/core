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

jest.mock('@mikojs/koa-react', () =>
  jest.fn().mockReturnValue({
    runWebpack: jest.fn(),
    middleware: jest
      .fn()
      .mockReturnValue(async (ctx: mixed, next: () => Promise<void>) => {
        await next();
      }),
  }),
);

test('server', async () => {
  (await server({ port: await getPort() })).close();
});
