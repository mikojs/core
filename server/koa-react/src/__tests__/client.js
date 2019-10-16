// @flow

import path from 'path';
import { type ComponentType } from 'react';

import { requireModule } from '@mikojs/utils';

import pagesTestings from './__ignore__/pagesTestings';

import CustomMain from './__ignore__/custom/.templates/Main';
import CustomLoading from './__ignore__/custom/.templates/Loading';
import CustomError from './__ignore__/custom/.templates/Error';
import CustomNotFound from './__ignore__/custom/.templates/NotFound';

import TemplateMain from 'templates/Main';
import TemplateLoading from 'templates/Loading';
import TemplateError from 'templates/Error';
import TemplateNotFound from 'templates/NotFound';

import testRender from 'components/testRender';

describe('client side testing', () => {
  test.each(pagesTestings)(
    'get %s',
    async (
      urlPath: string,
      chunkName: string,
      head: string,
      main: string,
      pageInitialProps: { to?: string },
      mainInitialProps: {},
    ) => {
      const mockLog = jest.fn();
      const isCustom = /custom/.test(urlPath);

      global.console.error = mockLog;

      expect(
        (await testRender({
          Main: isCustom ? CustomMain : TemplateMain,
          Loading: isCustom ? CustomLoading : TemplateLoading,
          Error: isCustom ? CustomError : TemplateError,
          routesData: [],
          InitialPage: ((): ComponentType<*> => {
            try {
              return requireModule(
                path.resolve(
                  __dirname,
                  './__ignore__',
                  chunkName.replace(/pages\//, isCustom ? '' : 'page/'),
                ),
              );
            } catch (e) {
              return isCustom ? CustomNotFound : TemplateNotFound;
            }
          })(),
          mainInitialProps,
          pageInitialProps,
        }))
          .html()
          .replace(/ style="[\w;:,()\-.%# ]*"/g, '')
          .replace(/<p> .*(<br>)?<\/p>/g, '<p></p>'),
      ).toBe(
        `<div>${main.replace(/<!-- -->/g, '').replace(/&quot;/g, '"')}</div>`,
      );
      (/error/.test(urlPath)
        ? expect(mockLog)
        : expect(mockLog).not
      ).toHaveBeenCalled();
    },
  );
});
