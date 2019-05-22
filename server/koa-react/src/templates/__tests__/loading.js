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
    const main = global.document.createElement('main');

    main.setAttribute('id', '__CAT__');
    global.document.querySelector('body').appendChild(main);

    const wrapper = mount(<Loading />);

    expect(wrapper.find(ReactLoading).exists()).toBeTruthy();
    wrapper.unmount();
  });
});
