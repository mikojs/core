// @flow

import React from 'react';
import { mount } from 'enzyme';
import ReactLoading from 'react-loading';

import Loading from '../Loading';

describe('Loading', () => {
  test('Can not find main HTMLElement', () => {
    expect(() => {
      mount(<Loading />);
    }).toThrow('Can not find main HTMLElement');
  });

  test('work', () => {
    const mainDOM = global.document.createElement('main');
    const body = global.document.querySelector('body');

    mainDOM.setAttribute('id', '__CAT__');
    body.appendChild(mainDOM);

    const wrapper = mount(<Loading />);

    expect(wrapper.find(ReactLoading).exists()).toBeTruthy();
    wrapper.unmount();
  });
});
