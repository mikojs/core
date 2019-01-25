// @flow

import React from 'react';
import { mount } from 'enzyme';

import Root from '../Root';

test('Root', () => {
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
