// @flow

import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter as Router } from 'react-router-dom';

import Root from '../Root';
import { initStore } from '../server';

import Main from 'templates/Main';
import Loading from 'templates/Loading';
import ErrorComponent from 'templates/Error';

describe('root', () => {
  test('catch error', () => {
    // TODO component should be ignored
    // eslint-disable-next-line jsdoc/require-jsdoc
    const Component = () => <div>render</div>;

    Root.preload({
      originalUrl: '/',
      chunkName: 'test',
      initialProps: {},
      Component,
      Page: Component,
      lazyPage: async () => {
        throw new Error('Can not use init lazy Page');
      },
    });

    const wrapper = mount(
      <Router location="/" context={{ originalUrl: '/' }}>
        <Root
          Main={Main}
          Loading={Loading}
          Error={ErrorComponent}
          routesData={[]}
          mainInitialProps={{}}
        />
      </Router>,
    );

    wrapper.find(Component).simulateError(new Error('test error'));
    expect(
      wrapper.contains(<p style={{ color: 'red' }}>test error</p>),
    ).toBeTruthy();
  });

  test('head is null when getting page', async () => {
    initStore();
    Root.getPage(
      [
        {
          exact: true,
          path: ['/'],
          component: {
            loader: async () => ({
              default: () => null,
            }),
            chunkName: 'test',
          },
        },
      ],
      {
        location: {
          pathname: '/',
          search: '',
        },
      },
    );
    await Root.preload().lazyPage();

    expect(Root.preload().initialProps.head).toBeUndefined();
  });
});
