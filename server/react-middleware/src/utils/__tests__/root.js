// @flow

import React from 'react';
import { mount } from 'enzyme';

import Root from '../Root';

test('Root', () => {
  const wrapper = mount(
    <Root
      routesData={[
        {
          routePath: ['*'],
          chunkName: '/',
          component: () => <div>render</div>,
        },
      ]}
    />,
  );

  expect(wrapper.contains(<div>render</div>)).toBeTruthy();
});
