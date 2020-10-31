// @flow

import path from 'path';

import testingServer, { type fetchResultType } from '../testingServer';

const query = `
  {
    version
  }
`;
const expected = {
  data: {
    version: '1.0.0',
  },
};

describe('router', () => {
  beforeAll(async () => {
    await testingServer.run(path.resolve(__dirname, './__ignore__'));
  });

  test('fetch', async () => {
    expect(
      await testingServer
        .fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query,
          }),
        })
        .then((res: fetchResultType) => res.json()),
    ).toEqual(expected);
  });

  test('graphql', async () => {
    expect(
      await testingServer.graphql({
        source: query,
      }),
    ).toEqual(expected);
  });

  afterAll(() => {
    testingServer.close();
  });
});
