// @flow

import React from 'react';
import { mount } from 'enzyme';

import Cms from '../index';

test('react-cms', () => {
  expect(mount(<Cms />).exists()).toBeTruthy();
});
