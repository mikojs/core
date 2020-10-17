// @flow

import mergeDir from '@mikojs/merge-dir';

import server from '../index';
import testingServer, { type fetchResultType } from '../testingServer';

describe('server', () => {
  beforeAll(async () => {
    await testingServer.run(
      mergeDir.use(
        __dirname,
        undefined,
        () => `module.exports = (req, res) => {
  res.end(req.url);
};`,
      ),
    );
  });

  test('fetch', async () => {
    expect(
      await testingServer.fetch('/').then((res: fetchResultType) => res.text()),
    ).toBe('/');
  });

  test('build', async () => {
    expect(await server.build()).toBeUndefined();
  });

  afterAll(() => {
    testingServer.close();
  });
});
