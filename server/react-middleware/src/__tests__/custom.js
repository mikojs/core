// @flow

import path from 'path';

import Koa, { type ServerType as koaServerType } from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import react from '../index';

describe('react middleware', () => {
  let server: koaServerType;
  let port: number;

  beforeAll(async () => {
    const app = new Koa();

    app.use(
      await react({
        folderPath: path.resolve(__dirname, './__ignore__/custom'),
      }),
    );

    port = await getPort();
    server = app.listen(port);
  });

  test('get custom page', async () => {
    expect(
      await fetch(`http://localhost:${port}`).then((res: ResponseType) =>
        res.text(),
      ),
    ).toBe('<main id="__cat__"><div data-reactroot="">/</div></main>');
  });

  afterAll(() => {
    server.close();
  });
});
