// @flow

import React from 'react';
import { mount } from 'enzyme';
import { Helmet } from 'react-helmet';

import loadInitialProps from '../loadInitialProps';

const location = {
  pathname: '/',
  search: '?key=value',
};
let initialized: boolean = false;

window.__CAT_DATA__ = { text: 'init value' };

jest.useFakeTimers();

describe('load init props', () => {
  test.each`
    info                                           | noFunc   | result
    ${'first time load init props from server'}    | ${false} | ${'init value'}
    ${'second time load init props with function'} | ${false} | ${'get initiail props'}
    ${'no getInitialProps'}                        | ${true}  | ${''}
  `(
    '$info',
    async ({ result, noFunc }: { result: string, noFunc: boolean }) => {
      const wrapper = mount(
        loadInitialProps({
          default: ({ text }: { text: string }) => <div>{text}</div>,
          getInitialProps: noFunc
            ? undefined
            : async () =>
                await {
                  text: 'get initiail props',
                },
        }),
      );
      wrapper.setProps({ location });

      if (!initialized) initialized = true;
      else await wrapper.instance().load();

      expect(wrapper.text()).toBe(result);
    },
  );

  test('custom head', async () => {
    const head = <title>title</title>;
    const wrapper = mount(
      loadInitialProps({
        default: ({ text }: { text: string }) => <div>{text}</div>,
        getInitialProps: async () =>
          await {
            text: 'get initiail props',
            head: <Helmet>{head}</Helmet>,
          },
      }),
    );
    wrapper.setProps({ location });

    await wrapper.instance().load();

    const title = Helmet.renderStatic().title.toComponent();

    expect(wrapper.text()).toBe('get initiail props');
    expect(title).toHaveLength(1);
    expect(title[0]).toBe(head);
  });
});
