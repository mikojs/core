// @flow

import React from 'react';
import { mount } from 'enzyme';

import Provider from '../Provider';
import { type dataType } from '../types';

import { Example } from './__ignore__/source';
import getItem from './__ignore__/getItem';
import findDiff from './__ignore__/findDiff';

let newComponent: $ElementType<dataType, number>;
const wrapper = mount(
  <Provider components={[Example]}>
    <div />
  </Provider>,
);

describe('Provider', () => {
  beforeAll(() => {
    newComponent = wrapper
      .state('components')
      .find(
        ({ kind }: $ElementType<dataType, number>) => kind === 'new-component',
      );
  });

  test('new-component hover previewer', () => {
    const previewer = wrapper.state('previewer');

    wrapper.instance().hover(getItem(newComponent), getItem(previewer[0]));

    expect(findDiff(previewer, wrapper.state('previewer'))).toEqual({
      type: 'add',
      components: ['preview-component'],
    });
  });

  test('new-component hover manager', () => {
    const previewer = wrapper.state('previewer');

    wrapper
      .instance()
      .hover(getItem(newComponent), getItem(wrapper.state('components')[0]));

    expect(findDiff(previewer, wrapper.state('previewer'))).toEqual({
      type: 'remove',
      components: ['preview-component'],
    });
  });

  test('add new-component to previewer', () => {
    const previewer = wrapper.state('previewer');

    wrapper.instance().hover(getItem(newComponent), getItem(previewer[0]));

    expect(findDiff(previewer, wrapper.state('previewer'))).toEqual({
      type: 'add',
      components: ['preview-component'],
    });

    wrapper.instance().drop(getItem(newComponent), getItem(previewer[0]));

    expect(findDiff(previewer, wrapper.state('previewer'))).toEqual({
      type: 'add',
      components: ['component'],
    });
  });

  test('remove component in previewer', () => {
    const previewer = wrapper.state('previewer');

    wrapper
      .instance()
      .drop(
        getItem(
          previewer.find(
            ({ kind }: $ElementType<dataType, number>) => kind === 'component',
          ),
        ),
        getItem(wrapper.state('components')[0]),
      );

    expect(findDiff(previewer, wrapper.state('previewer'))).toEqual({
      type: 'remove',
      components: ['component'],
    });
  });
});
