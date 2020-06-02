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

const folderPath = path.resolve(__dirname, './__ignore__/pages');
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
        ${'/'}               | ${getPage}     | ${'init'}   | ${!useBasename ? 'pages/index' : 'pages/basename'}
        ${'/?key=value'}     | ${getPage}     | ${'init'}   | ${!useBasename ? 'pages/index' : 'pages/basename'}
        ${'/page'}           | ${getPage}     | ${'init'}   | ${!useBasename ? 'pages/page' : 'pages/basename/page'}
        ${'/value'}          | ${getValue}    | ${'init'}   | ${!useBasename ? 'pages/:key' : 'pages/basename/:key'}
        ${'/test/not-found'} | ${getNotFound} | ${'init'}   | ${!useBasename ? 'template/notFound' : 'template/basename/notFound'}
        ${'/test'}           | ${getPage}     | ${'init'}   | ${!useBasename ? 'pages/test' : 'pages/basename/test'}
        ${'/test/page'}      | ${getPage}     | ${'init'}   | ${!useBasename ? 'pages/test/page' : 'pages/basename/test/page'}
        ${'/test/page'}      | ${getNotFound} | ${'unlink'} | ${!useBasename ? 'template/notFound' : 'template/basename/notFound'}
        ${'/page'}           | ${getPage}     | ${'error'}  | ${!useBasename ? 'pages/page' : 'pages/basename/page'}
      `(
        'fetch $pathname',
        async ({
          pathname,
          getContent,
          updateEvent,
          chunkName,
        }: {|
          pathname: string,
          getContent: typeof getPage,
          updateEvent: mergeDirEventType,
          chunkName: string,
        |}) => {
          const newPathname = `${!useBasename ? '' : '/basename'}${pathname}`;
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
              .fetch(newPathname)
              .then((res: fetchResultType) => res.text()),
          ).toEqual(
            getContent(chunkName, newPathname.replace(/\?.*$/, ''), false),
          );

          [
            'Document.js',
            'Error.js',
            'Loading.js',
            'Main.js',
            'NotFound.js',
            'Others.js',
          ].forEach((filename: string) => {
            mockUpdate.cache[0](
              'unlink',
              path.resolve(folderPath, '.templates', filename),
            );
          });

          expect(
            await server
              .fetch(newPathname)
              .then((res: fetchResultType) => res.text()),
          ).toEqual(
            getContent(chunkName, newPathname.replace(/\?.*$/, ''), true),
          );
        },
      );
    },
  );

  afterAll(() => {
    server.close();
  });
});
