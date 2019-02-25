// @flow

import path from 'path';

import Koa, { type ServerType as koaServerType } from 'koa';
import getPort from 'get-port';

import react from '../../index';

export default async (): Promise<{
  domain: string,
  server: koaServerType,
}> => {
  const app = new Koa();
  const port = process.env.NODE_PORT || (await getPort());

  app.use(
    await react({
      folderPath: path.resolve(__dirname, './custom'),
      basename: '/custom',
    }),
  );

  app.use(
    await react({
      folderPath: path.resolve(__dirname, './page'),
    }),
  );

  return {
    domain: `http://localhost:${port}`,
    server: app.listen(port),
  };
};
