// @flow

import React from 'react';
import { act } from 'react-dom/test-utils';

import client from '../client';

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
        pageInitialProps: {},
        chunkName,
      };

      await expect(client()).rejects.toThrow(message);
    },
  );

  test('work', async () => {
    const expected = '<main id="__CAT__"><div>test</div></main>';

    global.document.querySelector('body').innerHTML = expected;
    window.__CAT_DATA__ = {
      mainInitialProps: {},
      pageInitialProps: {},
      chunkName: 'test',
    };

    await act(async () => {
      await client();
    });

    expect(global.document.querySelector('body').innerHTML).toBe(expected);
  });
});
