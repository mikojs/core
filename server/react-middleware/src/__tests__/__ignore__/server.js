// @flow

import path from 'path';

import Koa, { type ServerType as koaServerType } from 'koa';
import getPort from 'get-port';

import react, { buildStatic } from '../../index';

export default async (
  dev: boolean,
  useStatic: boolean,
): Promise<{
  domain: string,
  server: koaServerType,
}> => {
  const app = new Koa();
  const port = parseInt(process.env.NODE_PORT || (await getPort()), 10);

  app.use(
    await react({
      dev,
      folderPath: path.resolve(__dirname, './custom'),
      basename: '/custom',
      useStatic,
    }),
  );

  app.use(
    await react({
      dev,
      folderPath: path.resolve(__dirname, './page'),
      useStatic,
    }),
  );

  return {
    domain: `http://localhost:${port}`,
    server: await new Promise(resolve => {
      // $FlowFixMe https://github.com/flow-typed/flow-typed/pull/3221
      const server = app.listen(port, async () => {
        const { log } = console;

        await buildStatic(server, {
          port,
          folderPath: path.resolve(
            __dirname,
            '../../../node_modules/test-static',
          ),
        });

        if (process.env.NODE_ENV !== 'test') log(`Run server at port: ${port}`);

        resolve(server);
      });
    }),
  };
};
