// @flow

import React from 'react';
import { mount } from 'enzyme';
import ReactLoading from 'react-loading';

import Loading from '../Loading';

describe('loading', () => {
  test('can not find main HTMLElement', () => {
    const mockLog = jest.fn();

    global.console.error = mockLog;

    expect(() => {
      mount(<Loading />);
    }).toThrow('Can not find main HTMLElement');
    expect(mockLog).toHaveBeenCalled();
  });

  test('can render', () => {
    const main = global.document.createElement('main');

    main.setAttribute('id', '__MIKOJS__');
    global.document.querySelector('body').appendChild(main);

    const wrapper = mount(<Loading />);

    expect(wrapper.find(ReactLoading).exists()).toBeTruthy();
    wrapper.unmount();
  });
});
