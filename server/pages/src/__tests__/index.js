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

import { getPage, getNotFound, getValue } from './__ignore__/testings';

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
        pathname             | getContent     | updateEvent | chunkName
        ${'/'}               | ${getPage}     | ${'init'}   | ${'pages/index'}
        ${'/?key=value'}     | ${getPage}     | ${'init'}   | ${'pages/index'}
        ${'/page'}           | ${getPage}     | ${'init'}   | ${'pages/page'}
        ${'/value'}          | ${getValue}    | ${'init'}   | ${'pages/:key'}
        ${'/test/not-found'} | ${getNotFound} | ${'init'}   | ${'template/notFound'}
        ${'/test'}           | ${getPage}     | ${'init'}   | ${'pages/test'}
        ${'/test/page'}      | ${getPage}     | ${'init'}   | ${'pages/test/page'}
        ${'/test/page'}      | ${getNotFound} | ${'unlink'} | ${'template/notFound'}
        ${'/page'}           | ${getPage}     | ${'error'}  | ${'pages/page'}
      `(
        'fetch $pathname',
        async ({
          pathname,
          getContent,
          updateEvent,
          chunkName,
        }: {|
          pathname: string,
          getContent: (pathname: string, chunkName: string) => string,
          updateEvent: mergeDirEventType,
          chunkName: string,
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
            ['<!DOCTYPE html>', ...getContent(pathname, chunkName)].join(''),
          );
        },
      );
    },
  );

  afterAll(() => {
    server.close();
  });
});
