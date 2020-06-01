/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import { mockUpdate, type mergeDirEventType } from '@mikojs/utils/lib/mergeDir';
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
        pathname             | getContent     | updateEvent
        ${'/'}               | ${getPage}     | ${'init'}
        ${'/?key=value'}     | ${getPage}     | ${'init'}
        ${'/page'}           | ${getPage}     | ${'init'}
        ${'/value'}          | ${getPage}     | ${'init'}
        ${'/test/not-found'} | ${getNotFound} | ${'init'}
        ${'/test'}           | ${getPage}     | ${'init'}
        ${'/test/page'}      | ${getPage}     | ${'init'}
        ${'/test/page'}      | ${getPage}     | ${'unlink'}
        ${'/page'}           | ${getPage}     | ${'error'}
      `(
        'fetch $pathname',
        async ({
          pathname,
          getContent,
          updateEvent,
        }: {|
          pathname: string,
          getContent: (basename?: string) => string,
          updateEvent: mergeDirEventType,
        |}) => {
          const folderPath = path.resolve(__dirname, './__ignore__/pages');
          const pages = buildPages(
            folderPath,
            !useBasename ? undefined : { basename: 'basename' },
          );

          await server.run(pages.middleware);

          if (updateEvent !== 'init') {
            expect(mockUpdate.cache).toHaveLength(1);

            mockUpdate.cache[0](
              updateEvent,
              path.resolve(folderPath, `.${pathname}.js`),
            );
          }

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
