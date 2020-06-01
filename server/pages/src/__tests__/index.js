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
          getContent: (pathname: string, chunkName: string) => string,
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
          ).toEqual(getContent(chunkName, newPathname.replace(/\?.*$/, '')));
        },
      );
    },
  );

  test('default templates', async () => {
    const pages = buildPages(folderPath);

    await server.run(pages.middleware);

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
      await server.fetch('/').then((res: fetchResultType) => res.text()),
    ).toEqual(
      [
        '<!DOCTYPE html>',
        '<html lang="en"><head>',
        '<meta data-react-helmet="true" charSet="utf-8"/>',
        '<meta data-react-helmet="true" name="viewport" content="width=device-width, initial-scale=1"/>',
        '<title data-react-helmet="true">mikojs</title>',
        '<link data-react-helmet="true" rel="stylesheet" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"/>',
        '</head><body>',
        '<main id="__MIKOJS__"><div>/</div></main>',
        '<script data-react-helmet="true">',
        'var __MIKOJS_DATA__ = {"mainInitialProps":{},"pageInitialProps":{"pathname":"/"},"chunkName":"pages/index"};',
        '</script></body></html>',
      ].join(''),
    );
  });

  afterAll(() => {
    server.close();
  });
});
