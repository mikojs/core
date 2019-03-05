/**
 * @jest-environment node
 *
 * @flow
 */

import stream from 'stream';

import React from 'react';
import { renderToNodeStream as reactServerRender } from 'react-dom/server';

import { lazy, preload, renderToNodeStream } from '../ReactIsomorphic';

describe('react isomorphic', () => {
  test('render empty array', async () => {
    expect(await preload()).toBeUndefined();
  });

  test('not render again', async () => {
    const lazyComponent = jest.fn(async () => ({
      default: () => null,
    }));
    const Test = lazy(lazyComponent, 'not-render-again');

    Test._status = 1;
    Test._result = () => null;

    await renderToNodeStream(<Test />, { stream, reactServerRender });

    expect(lazyComponent).not.toHaveBeenCalled();
  });

  test('preload too many times', async () => {
    await expect(preload(['test'])).rejects.toThrow(
      'Can not find those chunks: ["test"]',
    );
  });

  test('render to node stream', async () => {
    await expect(
      renderToNodeStream(
        React.createElement(() =>
          React.createElement(
            lazy(
              async () => ({
                default: () => null,
              }),
              (Math.floor(Math.random() * 100) + 1).toString(),
            ),
          ),
        ),
        { stream, reactServerRender },
      ),
    ).rejects.toThrow(
      'Don not use too many `dynamic import` under other `dynamic import`. This is just an alternative plan before `react.lazy` support sever side rendering.',
    );
  });
});
