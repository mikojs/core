// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import React from '@mikojs/koa-react';

import { version } from '../../package.json';

import { createEnvironment } from 'utils/createEnvironment';

const react = new React(path.resolve(__dirname, '../pages'));

jest.mock('utils/createEnvironment', (): {|
  createEnvironment: () => mixed,
|} => {
  const { createMockEnvironment } = jest.requireActual('relay-test-utils');
  const environment = createMockEnvironment();

  return {
    createEnvironment: () => environment,
  };
});

describe('pages', () => {
  test.each`
    url    | data           | html
    ${'/'} | ${{ version }} | ${`<div>${JSON.stringify({ version })}</div>`}
  `(
    'page $url',
    async ({ url, data, html }: {| url: string, data: {}, html: string |}) => {
      const wrapper = await react.render(url, {
        Loading: emptyFunction.thatReturnsNull,
      });

      createEnvironment(undefined, 'key').mock.resolveMostRecentOperation(
        () => ({
          data,
        }),
      );
      wrapper.update();

      expect(wrapper.html()).toBe(html);
    },
  );
});
