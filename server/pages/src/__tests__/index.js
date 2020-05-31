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

import { getPage, getNotFound } from './__ignore__/testings';

const server = testingServer();

describe('pages', () => {
  beforeEach(() => {
    mockUpdate.clear();
  });

  describe.each`
    useBasename
    ${true}
    ${false}
  `(
    'use basename = $useBasename',
    ({ useBasename }: {| useBasename: boolean |}) => {
      test.each`
        pathname       | getContent
        ${'/'}         | ${getPage}
        ${'/notFound'} | ${getNotFound}
      `(
        'fetch $pathname',
        async ({
          pathname,
          getContent,
        }: {|
          pathname: string,
          getContent: (basename?: string) => string,
        |}) => {
          const folderPath = path.resolve(__dirname, './__ignore__/pages');
          const pages = buildPages(
            folderPath,
            !useBasename ? undefined : { basename: 'basename' },
          );

          await server.run(pages.middleware);

          expect(
            await server
              .fetch(`${!useBasename ? '' : '/basename'}${pathname}`)
              .then((res: fetchResultType) => res.text()),
          ).toEqual(
            [
              '<!DOCTYPE html>',
              ...getContent(!useBasename ? undefined : 'basename'),
            ].join(''),
          );
        },
      );
    },
  );

  afterAll(() => {
    server.close();
  });
});
