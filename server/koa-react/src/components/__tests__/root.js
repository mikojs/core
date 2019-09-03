// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { MemoryRouter as Router, Link } from 'react-router-dom';
import { emptyFunction } from 'fbjs';

import Root from '../Root';

import Main, { mainRender } from './__ignore__/Main';
import Loading, { loadingRender } from './__ignore__/Loading';
import PageA, { pageARender } from './__ignore__/PageA';
import PageB, { pageBRender } from './__ignore__/PageB';

const wrapper = mount(
  <Router>
    <Root
      Main={Main}
      Loading={Loading}
      Error={emptyFunction.thatReturnsNull}
      routesData={[
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
      ]}
      InitialPage={PageA}
      mainInitialProps={{}}
      pageInitialProps={{}}
    />
  </Router>,
);

describe('Root', () => {
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
              ReactDOM.findDOMNode(wrapper.find(Link).instance()),
              { button: 0 },
            );
          });

        // TODO: remove, https://github.com/airbnb/enzyme/issues/2171
        wrapper.update();

        expect(wrapper.contains(<Page />)).toBeTruthy();
      });

      [
        Main.getInitialProps,
        mainRender,
        PageA.getInitialProps,
        pageARender,
        PageB.getInitialProps,
        pageBRender,
        loadingRender,
      ].forEach(
        (mockFn: JestMockFn<$ReadOnlyArray<void>, void>, index: number) => {
          const expectedTime = expectedTimes[index];

          test(
            [
              'Main.getInitialProps',
              'mainRender',
              'PageA.getInitialProps',
              'pageARender',
              'PageB.getInitialProps',
              'pageBRender',
              'loadingRender',
            ][index],
            () => {
              if (expectedTime === 0) expect(mockFn).not.toHaveBeenCalled();
              else expect(mockFn).toHaveBeenCalledTimes(expectedTime);
            },
          );
        },
      );
    },
  );

  test('update page after component is unmount', async () => {
    mainRender.mockReset();

    expect(mainRender).not.toHaveBeenCalled();

    wrapper.find(Link).simulate('click', { button: 0 });

    expect(mainRender).toHaveBeenCalledTimes(1);

    wrapper.unmount();

    expect(mainRender).toHaveBeenCalledTimes(1);
  });
});
