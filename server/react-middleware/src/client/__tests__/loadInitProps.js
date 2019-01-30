// @flow

import React from 'react';
import { mount } from 'enzyme';

import loadInitProps from '../loadInitProps';

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
        loadInitProps({
          default: ({ text }: { text: string }) => <div>{text}</div>,
          getInitialProps: noFunc
            ? undefined
            : async () =>
                await {
                  text: 'get initiail props',
                },
        }),
      );

      if (!initialized) initialized = true;
      // $FlowFixMe https://github.com/flow-typed/flow-typed/pull/3107
      else await wrapper.instance().load();

      expect(wrapper.text()).toBe(result);
    },
  );
});
