// @flow

import mergeDir from '@mikojs/merge-dir';

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

  afterAll(() => {
    testingServer.close();
  });
});
