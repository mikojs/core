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
  describe.each`
    dev
    ${true}
    ${false}
  `('dev = $dev', ({ dev }: {| dev: boolean |}) => {
    beforeAll(async () => {
      reactObj = await react(
        path.resolve(__dirname, './__ignore__/pages'),
        dev ? undefined : { dev },
      );
      reactObj.update(path.resolve(__dirname, './__ignore__/pages/index.js'));
      reactObj.update(path.resolve(__dirname));
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

    test('build', async () => {
      const mockLog = jest.fn();

      global.console.log = mockLog;

      expect(await reactObj.buildJs()).toEqual({
        commons: 'commons',
        client: 'client',
      });
      expect(mockLog).toHaveBeenCalledTimes(1);
    });
  });
});
