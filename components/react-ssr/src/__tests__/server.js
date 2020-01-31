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
  Page,
  chunkName,
  routesData,
} from './__ignore__/testings';

const errorCallback = jest.fn();

/**
 * @example
 * renderServer()
 *
 * @return {string} - render string
 */
const renderServer = () =>
  server(
    { url: chunkName, path: chunkName },
    // $FlowFixMe jest mock
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

  test('error', async () => {
    ErrorComponent.mockImplementation(({ error }: {| error: Error |}) => (
      <div>{error.message}</div>
    ));
    Page.mockImplementation(() => {
      throw new Error('render error');
    });

    expect(await renderServer()).toBe('<!DOCTYPE html><main id="__MIKOJS__">');
    expect(errorCallback).toHaveBeenCalledTimes(1);
    expect(errorCallback).toHaveBeenCalledWith(
      '<div>render error</div></main>',
    );
  });
});
