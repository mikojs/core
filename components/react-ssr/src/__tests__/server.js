/**
 * @jest-environment node
 *
 * @flow
 */

import type MultistreamType from 'multistream';

import server from '../server';

import testings, {
  Document,
  Main,
  ErrorComponent,
  pageRender,
  chunkName,
  routes,
} from './__ignore__/testings';

/**
 * @return {string} - render string
 */
const renderServer = () =>
  server(
    `https://localhost${chunkName}`,
    { pathname: chunkName, hash: '', search: '' },
    { Document, Main, Error: ErrorComponent, routes },
  ).then(
    (stream: MultistreamType) =>
      new Promise(resolve => {
        let output: string = '';

        stream.on('data', (chunk: string) => {
          output = `${output}${chunk}`;
        });
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

    expect(await renderServer()).toBe(
      `<!DOCTYPE html><main id="__MIKOJS__"><div>Render error</div><script>var errorProps = { error: new Error(Render error), errorInfo: { componentStack: &#x27;&#x27; } }
if (!__MIKOJS_DATA__) var __MIKOJS_DATA__ = { errorProps };
else __MIKOJS_DATA__.errorProps = errorProps;</script></main>`,
    );
  });
});
