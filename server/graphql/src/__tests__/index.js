// @flow

import path from 'path';

import { mockUpdate } from '@mikojs/utils/lib/mergeDir';
import testingServer, {
  type fetchResultType,
} from '@mikojs/server/lib/testingServer';

import buildGraphql from '../index';

import testings from './__ignore__/testings';

const server = testingServer();
const folderPath = path.resolve(__dirname, './__ignore__/graphql');

describe('graphql', () => {
  beforeEach(() => {
    mockUpdate.clear();
  });

  test.each(testings)('%s', async (query: string, expected: {}) => {
    await server.run(buildGraphql(folderPath));

    expect(
      await server
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
    ).toEqual({
      data: expected,
    });
  });

  afterAll(() => {
    server.close();
  });
});
