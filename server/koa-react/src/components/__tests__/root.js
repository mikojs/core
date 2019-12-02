// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { Link } from 'react-router-dom';
import { emptyFunction } from 'fbjs';

import testRender, { type wrapperType } from '../testRender';

import Main, { mainRender } from './__ignore__/Main';
import Loading, { loadingRender } from './__ignore__/Loading';
import PageA, { pageARender } from './__ignore__/PageA';
import PageB, { pageBRender } from './__ignore__/PageB';

const props = {
  Main,
  Loading,
  Error: emptyFunction.thatReturnsNull,
  routesData: [
    {
      exact: true,
      path: ['/pageA'],
      component: {
        filePath: '/pageA',
        chunkName: '/pageA',
        loader: async () => ({ default: PageA }),
      },
    },
    {
      exact: true,
      path: ['/pageB'],
      component: {
        filePath: '/pageB',
        chunkName: '/pageB',
        loader: async () => ({ default: PageB }),
      },
    },
  ],
  InitialPage: PageA,
  mainInitialProps: {},
  pageInitialProps: {},
};
const MOCK_FUNCS = {
  'Main.getInitialProps': Main.getInitialProps,
  mainRender: mainRender,
  'PageA.getInitialProps': PageA.getInitialProps,
  pageARender: pageARender,
  'PageB.getInitialProps': PageB.getInitialProps,
  pageBRender: pageBRender,
  loadingRender: loadingRender,
};
let wrapper: wrapperType;

describe('Root', () => {
  beforeAll(async () => {
    wrapper = await testRender(props);
  });

  describe.each`
    info              | expectedTimes            | Page
    ${'first mount'}  | ${[0, 1, 0, 1, 0, 0, 0]} | ${PageA}
    ${'go to /pageB'} | ${[1, 3, 0, 1, 1, 1, 1]} | ${PageB}
    ${'go to /pageA'} | ${[2, 5, 1, 2, 1, 1, 2]} | ${PageA}
  `(
    '$info',
    ({
      info,
      expectedTimes,
      Page,
    }: {|
      info: string,
      expectedTimes: $ReadOnlyArray<number>,
      Page: typeof PageA | typeof PageB,
    |}) => {
      test('click Link for going to the new page', async () => {
        if (info !== 'first mount')
          // TODO: modify, https://github.com/airbnb/enzyme/issues/2171
          await act(async () => {
            Simulate.click(
              // $FlowFixMe
              ReactDOM.findDOMNode(wrapper.find('a').instance()),
              { button: 0 },
            );
          });

        // TODO: remove, https://github.com/airbnb/enzyme/issues/2171
        wrapper.update();

        expect(wrapper.contains(<Page />)).toBeTruthy();
      });

      test.each([
        ['Main.getInitialProps'],
        ['mainRender'],
        ['PageA.getInitialProps'],
        ['pageARender'],
        ['PageB.getInitialProps'],
        ['pageBRender'],
        ['loadingRender'],
      ])('%s', (mockFnName: string) => {
        const mockFn = MOCK_FUNCS[mockFnName];
        const expectedTime =
          expectedTimes[Object.keys(MOCK_FUNCS).indexOf(mockFnName)];

        if (expectedTime === 0) expect(mockFn).not.toHaveBeenCalled();
        else expect(mockFn).toHaveBeenCalledTimes(expectedTime);
      });
    },
  );

  test('update page after component is unmount', async () => {
    mainRender.mockClear();

    expect(mainRender).not.toHaveBeenCalled();

    wrapper.find(Link).simulate('click', { button: 0 });

    expect(mainRender).toHaveBeenCalledTimes(1);

    wrapper.unmount();

    expect(mainRender).toHaveBeenCalledTimes(1);
  });

  test('test render go to the pageA by link', async () => {
    expect(
      (await testRender(props, '/pageA')).contains(<PageA />),
    ).toBeTruthy();
  });
});
