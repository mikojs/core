// @flow

import path from 'path';

import { emptyFunction } from 'fbjs';

import React from '@mikojs/koa-react';

import { version } from '../../package.json';

const react = new React(path.resolve(__dirname, '../pages'));

describe('pages', () => {
  describe('client', () => {
    beforeAll(() => {
      jest.resetModules();
      jest.mock('utils/createEnvironment', (): ({|
        createEnvironment: () => mixed,
      |}) => {
        const { createMockEnvironment } = jest.requireActual(
          'relay-test-utils',
        );
        const environment = createMockEnvironment();

        return {
          createEnvironment: () => environment,
        };
      });

      require('@mikojs/jest/lib/react');
    });

    test('request data fail', async () => {
      const { createEnvironment } = require('utils/createEnvironment');

      const wrapper = await react.render('/', {
        Loading: emptyFunction.thatReturnsNull,
      });

      createEnvironment().mock.rejectMostRecentOperation(new Error('error'));
      wrapper.update();

      expect(wrapper.html()).toBe('<div>error</div>');
    });

    test.each`
      url    | data           | html
      ${'/'} | ${{ version }} | ${`<div>${JSON.stringify({ version })}</div>`}
    `(
      'page $url',
      async ({
        url,
        data,
        html,
      }: {|
        url: string,
        data: {},
        html: string,
      |}) => {
        const { createEnvironment } = require('utils/createEnvironment');

        const wrapper = await react.render(url, {
          Loading: emptyFunction.thatReturnsNull,
        });

        createEnvironment().mock.resolveMostRecentOperation(() => ({
          data,
        }));
        wrapper.update();

        expect(wrapper.html()).toBe(html);
      },
    );
  });

  describe('server', () => {
    beforeAll(() => {
      jest.resetModules();
      jest.mock('react-relay', () => ({
        ...jest.requireActual('react-relay'),
        fetchQuery: jest
          .fn()
          .mockResolvedValueOnce('Success')
          .mockRejectedValueOnce(Promise.resolve(new Error('Error'))),
      }));
      jest.mock('utils/createEnvironment', (): ({|
        initEnvironment: () => {},
        createEnvironment: () => mixed,
      |}) => {
        const { createMockEnvironment } = jest.requireActual(
          'relay-test-utils',
        );
        const environment = createMockEnvironment();

        return {
          initEnvironment: () => ({
            environment,
            relaySSR: {
              getCache: () => [],
            },
          }),
          createEnvironment: () => environment,
        };
      });

      require('@mikojs/jest/lib/react');
    });

    test.each`
      isError
      ${false}
      ${true}
    `(
      'request data with isError = $isError',
      async ({ isError }: {| isError: boolean |}) => {
        const { createEnvironment } = require('utils/createEnvironment');

        const mockLog = jest.fn();

        global.console.log = mockLog;

        const wrapper = await new React(
          path.resolve(__dirname, '../pages'),
        ).render('/', {
          Loading: emptyFunction.thatReturnsNull,
        });

        createEnvironment().mock.resolveMostRecentOperation(() => ({
          data: { version },
        }));
        wrapper.update();

        expect(wrapper.html()).toBe(
          `<div>${JSON.stringify({ version })}</div>`,
        );
        (isError ? expect(mockLog) : expect(mockLog).not).toHaveBeenCalled();
      },
    );
  });
});
