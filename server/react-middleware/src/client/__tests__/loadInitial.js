// @flow

import React from 'react';
import { mount } from 'enzyme';
import { Helmet } from 'react-helmet';

import { loading, render } from '../loadInitial';

const location = {
  pathname: '/',
  search: '?key=value',
};
let initialized: boolean = false;

window.__CAT_DATA__ = { text: 'initial value' };

jest.useFakeTimers();

describe('load initial props', () => {
  describe('loading', () => {
    test.each`
      error                 | expected
      ${new Error('error')} | ${'.*error.*'}
      ${null}               | ${'loading...'}
    `(
      'is loading error with isError = $isError',
      ({ error, expected }: { error: ?Error, expected: string }) => {
        expect(mount(loading({ error })).text()).toMatch(new RegExp(expected));
        Helmet.renderStatic().title.toComponent();
      },
    );
  });

  describe('render', () => {
    test.each`
      info                                              | noFunc   | result
      ${'first time load initial props from server'}    | ${false} | ${'initial value'}
      ${'second time load initial props with function'} | ${false} | ${'get initial props'}
      ${'no getInitialProps'}                           | ${true}  | ${''}
    `(
      '$info',
      async ({ result, noFunc }: { result: string, noFunc: boolean }) => {
        const wrapper = mount(
          render({
            default: ({ text }: { text: string }) => <div>{text}</div>,
            getInitialProps: noFunc
              ? undefined
              : async () =>
                  await {
                    text: 'get initial props',
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
        render({
          default: ({ text }: { text: string }) => <div>{text}</div>,
          getInitialProps: async () =>
            await {
              text: 'get initial props',
              head: <Helmet>{head}</Helmet>,
            },
        }),
      );
      wrapper.setProps({ location });

      await wrapper.instance().load();

      expect(wrapper.text()).toBe('get initial props');
      expect(Helmet.renderStatic().title.toComponent()).toEqual([head]);
    });
  });
});
