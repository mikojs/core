/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import { mockUpdate } from '@mikojs/utils/lib/mergeDir';
import testingServer, {
  type fetchResultType,
} from '@mikojs/server/lib/testingServer';

import buildPages from '../index';

import testings from './__ignore__/testings';

const server = testingServer();

describe('pages', () => {
  beforeEach(() => {
    mockUpdate.clear();
  });

  test.each(testings)('%s', async (pathname: string, expected: string) => {
    const folderPath = path.resolve(__dirname, './__ignore__/pages');
    const pages = buildPages(folderPath);

    await server.run(pages.middleware);

    expect(
      await server.fetch(pathname).then((res: fetchResultType) => res.text()),
    ).toEqual(expected);
  });

  afterAll(() => {
    server.close();
  });
});
