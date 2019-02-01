// @flow

import React from 'react';
import { mount } from 'enzyme';

import Root from '../Root';

describe('Root', () => {
  test('work', () => {
    const wrapper = mount(
      <Root
        routesData={[
          {
            key: 'key',
            path: ['*'],
            component: () => <div>render</div>,
            exact: true,
          },
        ]}
      />,
    );

    expect(wrapper.contains(<div>render</div>)).toBeTruthy();
  });

  test('catch error', () => {
    /* eslint-disable require-jsdoc, flowtype/require-return-type */
    const component = () => <div>render</div>;
    /* eslint-enable require-jsdoc, flowtype/require-return-type */
    const wrapper = mount(
      <Root
        routesData={[
          {
            key: 'key',
            path: ['*'],
            component,
            exact: true,
          },
        ]}
      />,
    );

    wrapper.find(component).simulateError(new Error('test error'));
    expect(
      wrapper.contains(<p style={{ color: 'red' }}>test error</p>),
    ).toBeTruthy();
  });
});
