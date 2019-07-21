// @flow

import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter as Router } from 'react-router-dom';

import Root from '../Root';
import PagesHelper from '../PagesHelper';

import Main from 'templates/Main';
import Loading from 'templates/Loading';
import ErrorComponent from 'templates/Error';

describe('root', () => {
  test('catch error', () => {
    /** @react default Component */
    const Component = () => <div>render</div>;

    const wrapper = mount(
      <Router location="/" context={{ originalUrl: '/' }}>
        <Root
          Main={Main}
          Loading={Loading}
          Error={ErrorComponent}
          pagesHelper={new PagesHelper([])}
          mainInitialProps={{}}
        />
      </Router>,
    );

    wrapper.find(Component).simulateError(new Error('test error'));
    expect(
      wrapper.contains(<p style={{ color: 'red' }}>test error</p>),
    ).toBeTruthy();
  });
});
