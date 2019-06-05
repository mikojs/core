// @flow

import Store from './index';

/**
 * @example
 * template(false, false)
 *
 * @param {boolean} useReact - use react or not
 * @param {boolean} useGraphql - use graphql or not
 *
 * @return {string} - jest
 */
const template = (useReact?: boolean, useGraphql?: boolean) => `/**
 * @jest-environment node
 *
 * @flow
 */

import path from 'path';

import fetch, { type Response as ResponseType } from 'node-fetch';

import server from '@cat-org/server/lib/bin';${
  !useGraphql
    ? ''
    : `

import { version } from '../../package.json';`
}

let runningServer: http$Server;

describe('server', () => {
  beforeAll(async () => {
    runningServer = await server({
      dev: true,
      src: path.resolve(__dirname, '..'),
      dir: path.resolve(__dirname, '..'),
      babelOptions: false,
    });
  });${
    !useReact
      ? ''
      : `

  describe('pages', () => {
    test('/', async () => {
      expect(
        await fetch('http://localhost:8000').then((res: ResponseType) =>
          res.text(),
        ),
      ).toBeDefined();
    });
  });`
  }${
  !useGraphql
    ? ''
    : `

  describe('graphql', () => {
    test('version', async () => {
      expect(
        await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            query: \`
  {
    version
  }
\`,
          }),
        }).then((res: ResponseType) => res.json()),
      ).toEqual({
        data: {
          version,
        },
      });
    });
  });`
}

  afterAll(() => {
    runningServer.close();
  });
});`;

/** jest store */
class Jest extends Store {
  /**
   * @example
   * jest.end(ctx)
   *
   * @param {Object} ctx - store context
   */
  +end = async ({
    useReact,
    useGraphql,
    lerna,
  }: $PropertyType<Store, 'ctx'>) => {
    if (!useReact && !useGraphql) return;

    await this.writeFiles({
      './src/__tests__/server.js': template(useReact, useGraphql),
    });

    if (lerna) return;

    await this.execa('yarn add --dev node-fetch');
  };
}

export default new Jest();
