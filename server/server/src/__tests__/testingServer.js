// @flow

import path from 'path';

import testingServer, { type fetchResultType } from '../testingServer';

const server = testingServer(() => '');

describe('testing server', () => {
  beforeEach(() => {
    server.use(path.resolve(__dirname, './__ignore__/folder'));
  });

  test.each`
    url
    ${'/'}
    ${'/id'}
  `('$url', async ({ url }: {| url: string |}) => {
    expect(
      await server.fetch(url).then((res: fetchResultType) => res.text()),
    ).toBe(url);
  });

  afterAll(() => {
    server.close();
  });
});
