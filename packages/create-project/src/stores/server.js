// @flow

import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import react from './react';
import pkg from './pkg';
import graphql from './graphql';
import Store from './index';

/**
 * @example
 * template(ctx)
 *
 * @param {Store.ctx} ctx - store context
 *
 * @return {string} - server template
 */
const template = ({
  useReact,
  useGraphql,
  useStyles,
  useRelay,
}: {
  ...$PropertyType<Store, 'ctx'>,
  useRelay: boolean,
}) => `/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import path from 'path';

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '@mikojs/server';
import base from '@mikojs/koa-base';${[
  !useGraphql
    ? null
    : `
import Graphql from '@mikojs/koa-graphql';`,
  !useReact
    ? null
    : `
import React from '@mikojs/koa-react';`,
  !['css', 'less'].includes(useStyles)
    ? null
    : `
import useCss from '@mikojs/use-css';`,
  useStyles !== 'less'
    ? null
    : `
import useLess from '@mikojs/use-less';`,
]
  .filter(Boolean)
  .join('')}

/**
 * @example
 * server(context)
 *
 * @param {contextType} context - the context of the server
 *
 * @return {object} - http server
 */
export default async ({${[
  !useRelay
    ? null
    : `
  src,`,
  `
  dir,
  dev,
  watch,
  port,`,
  !useRelay
    ? null
    : `
  close,`,
]
  .filter(Boolean)
  .join('')}
}: contextType): Promise<${!useRelay ? '' : '?'}http$Server> => {${[
  !useGraphql
    ? null
    : `
  const graphql = new Graphql(path.resolve(dir, './graphql'));`,
  !useReact || useGraphql || ![false, 'css'].includes(useStyles)
    ? null
    : `
  const react = new React(path.resolve(dir, './pages'), { dev }${
    !useStyles ? '' : ' |> useCss'
  });`,
  !useReact || useGraphql || useStyles !== 'less'
    ? null
    : `
  const react = new React(
    path.resolve(dir, './pages'),
    { dev } |> useCss |> useLess,
  );`,
  !useRelay || useStyles !== false
    ? null
    : `
  const react = new React(path.resolve(dir, './pages'), {
    dev,
    exclude: /__generated__/,
  });`,
  !useRelay || !useStyles
    ? null
    : `
  const react = new React(
    path.resolve(dir, './pages'),
    { dev, exclude: /__generated__/ } |> useCss${
      useStyles !== 'less' ? '' : ' |> useLess'
    },
  );`,
  !useRelay
    ? null
    : `

  await graphql.relay(['--src', src, '--exclude', '**/server.js']);

  if (dev && watch)
    graphql.relay(['--src', src, '--watch', '--exclude', '**/server.js']);

  if (process.env.SKIP_SERVER) {
    close();
    return null;
  }`,
]
  .filter(Boolean)
  .join('')}

  return (
    server.init()
    |> server.use(base)${[
      !useGraphql
        ? null
        : `
    |> (undefined
      |> server.start
      |> ('/graphql'
        |> server.all
        |> server.use(
          graphql.middleware({
            graphiql: dev,
            pretty: dev,
          }),
        )
        |> server.end)
      |> server.end)`,
      !useReact
        ? null
        : `
    |> server.use(await react.middleware())`,
    ]
      .filter(Boolean)
      .join('')}
    |> server.run(port)
    |> (dev && watch
      ? server.watch(dir, [${[
        !useGraphql ? null : 'graphql.update',
        !useReact ? null : 'react.update',
      ]
        .filter(Boolean)
        .join(', ')}])
      : emptyFunction.thatReturnsArgument)
  );
};`;

const basicTemplate = `/**
 * fixme-flow-file-annotation
 *
 * TODO: Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import { emptyFunction } from 'fbjs';

import server, { type contextType } from '@mikojs/server';
import base from '@mikojs/koa-base';

/**
 * @example
 * server(context)
 *
 * @param {contextType} context - the context of the server
 *
 * @return {object} - http server
 */
export default ({ dir, dev, watch, port, restart }: contextType) =>
  server.init()
  |> server.use(base)
  |> server.run(port)
  |> (dev && watch
    ? server.watch(dir, [restart])
    : emptyFunction.thatReturnsArgument);`;

/**
 * @example
 * testTemplate(ctx)
 *
 * @param {Store.ctx} ctx - store context
 *
 * @return {string} - server testing template
 */
const testTemplate = ({
  useReact,
  useGraphql,
  useRelay,
}: {
  ...$PropertyType<Store, 'ctx'>,
  useRelay: boolean,
}) => `// @flow

import getPort from 'get-port';

import server from '../server';${[
  !useGraphql
    ? null
    : `

jest.mock(
  '@mikojs/koa-graphql',
  () =>
    class MockGraphql {${
      !useReact
        ? ''
        : `
      relay = jest.fn();`
    }
      middleware = () => async (ctx: mixed, next: () => Promise<void>) => {
        await next();
      };
    },
);`,
  !useReact
    ? null
    : `

jest.mock(
  '@mikojs/koa-react',
  () =>
    class MockReact {
      middleware = () => async (ctx: mixed, next: () => Promise<void>) => {
        await next();
      };
    },
);`,
]
  .filter(Boolean)
  .join('')}

describe('server', () => {
  test.each\`
    dev      | watch${!useRelay ? '' : '    | SKIP_SERVER'}
    \${true}  | \${true}${!useRelay ? '' : '  | ${false}'}
    \${true}  | \${false}${!useRelay ? '' : ' | ${true}'}
    \${false} | \${true}${!useRelay ? '' : '  | ${false}'}
    \${false} | \${false}${!useRelay ? '' : ' | ${true}'}
  \`(
    'Running server with dev = $dev, watch = $watch${
      !useRelay ? '' : ', SKIP_SERVER = $SKIP_SERVER'
    }',
    async ${
      !useRelay
        ? '({ dev, watch }: {| dev: boolean, watch: boolean |})'
        : `({
      dev,
      watch,
      SKIP_SERVER,
    }: {|
      dev: boolean,
      watch: boolean,
      SKIP_SERVER: boolean,
    |})`
    } => {${
  !useRelay
    ? ''
    : `
      if (SKIP_SERVER) process.env.SKIP_SERVER = SKIP_SERVER.toString();
      else delete process.env.SKIP_SERVER;
`
}
      const runningServer = await server({
        src: __dirname,
        dir: __dirname,
        dev,
        watch,
        port: await getPort(),
        restart: jest.fn(),
        close: jest.fn(),
      });

      ${
        !useRelay
          ? 'expect(runningServer).not.toBeNull();'
          : `(!SKIP_SERVER
        ? expect(runningServer).not
        : expect(runningServer)
      ).toBeNull();`
      }

      ${!useRelay ? '' : 'if (!SKIP_SERVER) '}runningServer.close();
    },
  );
});`;

/** server store */
class Server extends Store {
  +subStores = [react, graphql, pkg];

  storeUseServer = false;

  /**
   * @example
   * server.checkServer()
   */
  +checkServer = memoizeOne(async () => {
    this.storeUseServer = (await this.prompt({
      name: 'useServer',
      message: 'use server or not',
      type: 'confirm',
      default: false,
    })).useServer;
    this.debug(this.storeUseServer);
  }, emptyFunction.thatReturnsTrue);

  /**
   * @example
   * server.start(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +start = async (ctx: $PropertyType<Store, 'ctx'>) => {
    await this.checkServer();

    ctx.useServer = this.storeUseServer;
  };

  /**
   * @example
   * server.end(ctx)
   *
   * @param {Store.ctx} ctx - store context
   */
  +end = async (ctx: $PropertyType<Store, 'ctx'>) => {
    const { lerna, useGraphql, useReact } = ctx;

    if (!this.storeUseServer) return;

    await this.writeFiles({
      'src/server.js':
        !useGraphql && !useReact
          ? basicTemplate
          : template({ ...ctx, useRelay: useGraphql && useReact }),
      'src/__tests__/server.js': testTemplate({
        ...ctx,
        useRelay: useGraphql && useReact,
      }),
    });

    if (lerna) return;

    await this.execa('yarn add fbjs', 'yarn add --dev get-port');
  };
}

export default new Server();
