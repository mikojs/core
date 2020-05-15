/**
 * @jest-environment node
 *
 * @flow
 */

import React from 'react';
import type MultistreamType from 'multistream';

import server from '../server';

import testings, {
  Document,
  Main,
  ErrorComponent,
  pageRender,
  chunkName,
  routesData,
} from './__ignore__/testings';

const errorCallback = jest.fn();

/**
 * @return {string} - render string
 */
const renderServer = () =>
  server(
    { url: chunkName, path: chunkName },
    { Document, Main, Error: ErrorComponent, routesData },
    <script />,
    errorCallback,
  ).then(
    (stream: MultistreamType) =>
      new Promise(resolve => {
        let output: string = '';

        stream.on('data', (chunk: string) => {
          output = `${output}${chunk}`;
        });
        stream.on('error', () => resolve(output));
        stream.on('end', () => resolve(output));
      }),
  );

describe('server', () => {
  test('work', async () => {
    expect(await renderServer()).toBe(
      `<!DOCTYPE html><main id="__MIKOJS__">${testings}</main>`,
    );
  });

  test('render error', async () => {
    pageRender.mockImplementation(() => {
      throw new Error('Render error');
    });

    expect(await renderServer()).toBe('<!DOCTYPE html><main id="__MIKOJS__">');
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback).toHaveBeenCalledWith(
      '<div>Render error</div></main>',
    );
  });
});
