// @flow

import React from 'react';
import { mount } from 'enzyme';
import { emptyFunction } from 'fbjs';

import client from '../client';
import Root from '../Root';

jest.mock('../../templates/routesData', () => [
  {
    exact: true,
    path: ['*'],
    component: {
      loader: async () => ({
        default: () => <div>test</div>,
      }),
      chunkName: 'test',
    },
  },
]);

describe('client', () => {
  test.each`
    message                            | chunkName
    ${'Can not find page component'}   | ${'not found'}
    ${'Can not find main HTMLElement'} | ${'test'}
  `(
    'error with message = $message',
    async ({
      message,
      chunkName,
    }: {|
      message: string,
      chunkName: string,
    |}) => {
      window.__CAT_DATA__ = {
        mainInitialProps: {},
        chunkName,
      };
      window.__CHUNKS_NAMES__ = [chunkName];

      await expect(client()).rejects.toThrow(message);
    },
  );

  test('work', async () => {
    global.document.querySelector('body').innerHTML =
      '<main id="__CAT__"><script>var __CHUNKS_NAMES__ = ["test"];</script></main>';

    await client();

    const {
      Page: { _result: Component = emptyFunction },
    } = Root.preload();

    expect(mount(<Component />).html()).toBe('<div>test</div>');
  });
});
