// @flow

import path from 'path';

import testingServer, {
  type fetchResultType,
} from './__ignore__/testingServer';

describe('server', () => {
  beforeAll(async () => {
    await testingServer.run(path.resolve(__dirname, './__ignore__/folder/foo'));
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
