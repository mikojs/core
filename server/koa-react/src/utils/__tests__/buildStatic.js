// @flow

import Koa from 'koa';
import getPort from 'get-port';
import { outputFileSync } from 'output-file-sync';

import prevBuildStatic, { buildStatic } from '../buildStatic';

describe('build static', () => {
  test('not routesData to build', async () => {
    expect(
      await buildStatic(new Koa().listen(await getPort())),
    ).toBeUndefined();
  });

  test('skip build html', async () => {
    outputFileSync.destPaths = [];
    outputFileSync.contents = [];

    prevBuildStatic(
      {
        routesData: [],
        templates: {
          document: 'document',
          main: 'main',
          loading: 'loading',
          error: 'error',
        },
      },
      'common.js',
    );

    expect(
      await buildStatic(new Koa().listen(await getPort())),
    ).toBeUndefined();
    expect(outputFileSync.destPaths).toHaveLength(0);
    expect(outputFileSync.contents).toHaveLength(0);
  });
});
