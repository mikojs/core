// @flow

import testingServer, { type fetchResultType } from '../testingServer';

jest.unmock('output-file-sync');

const server = testingServer();

describe('testing erver', () => {
  beforeAll(async () => {
    await server.use(__dirname);
  });

  test('fetch', async () => {
    expect(
      await server.fetch('/').then((res: fetchResultType) => res.text()),
    ).toBe('/');
  });

  afterAll(() => {
    server.close();
  });
});
