// @flow

import React from 'react';
import { mount } from 'enzyme';

import Dnd from '../index';
import Renderer from '../Renderer';

test('react-dnd', () => {
  expect(mount(<Dnd />).find(Renderer)).toBeTruthy();
});
