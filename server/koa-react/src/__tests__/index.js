/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import Koa from 'koa';
import getPort from 'get-port';
import fetch, { type Response as ResponseType } from 'node-fetch';

import react, { type returnType } from '../index';

import testings from './__ignore__/testings';

let reactObj: returnType;

describe('react', () => {
  beforeAll(async () => {
    reactObj = await react(path.resolve(__dirname, './__ignore__/pages'));
    reactObj.update(path.resolve(__dirname, './__ignore__/pages/index.js'));
  });

  test('middleware', async () => {
    const app = new Koa();
    const port = await getPort();

    app.use(reactObj.middleware);

    const server = app.listen(port);

    expect(
      await fetch(`http://localhost:${port}`).then((res: ResponseType) =>
        res.text(),
      ),
    ).toBe(testings);

    server.close();
  });
});
