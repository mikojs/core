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

describe('client side testing', () => {
  beforeAll(() => {
    global.document.querySelector('body').innerHTML =
      '<main id="__MIKOJS__"></main>';
  });

  beforeEach(() => {
    jest.resetModules();
  });

  test.each(pagesTestings)(
    'get %s',
    async (
      urlPath: string,
      chunkName: string,
      head: string,
      main: string,
      pageInitialProps: {},
      mainInitialProps: {},
    ) => {
      const React = require('react');
      const { MemoryRouter: Router } = require('react-router-dom');
      const enzyme = require('enzyme');
      const Adapter = require('enzyme-adapter-react-16');

      const Root = requireModule(path.resolve(__dirname, '../components/Root'));

      const { mount } = enzyme;
      const mockLog = jest.fn();

      enzyme.configure({ adapter: new Adapter() });

      const isCustom = /custom/.test(urlPath);
      const Main = isCustom ? CustomMain : TemplateMain;
      const Loading = isCustom ? CustomLoading : TemplateLoading;
      const ErrorComponent = isCustom ? CustomError : TemplateError;
      const InitialPage = ((): ComponentType<*> => {
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
      })();

      global.console.error = mockLog;

      expect(
        mount(
          <Router initialEntries={[urlPath]}>
            <Root
              Main={Main}
              Loading={Loading}
              Error={ErrorComponent}
              routesData={[]}
              InitialPage={InitialPage}
              mainInitialProps={mainInitialProps}
              pageInitialProps={pageInitialProps}
            />
          </Router>,
        )
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
