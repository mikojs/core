// @flow
// TODO: remove after react.lazy support server side

import typeof streamType, { Readable as ReadableType } from 'stream';

import React, { type Node as NodeType, type ComponentType } from 'react';
import { hydrate as reactClientRender } from 'react-dom';
import { typeof renderToNodeStream as renderToNodeStreamType } from 'react-dom/server';
import { invariant, ExecutionEnvironment } from 'fbjs';

type lazyDoneComponentType = ComponentType<*>;
export type lazyComponentType = () => Promise<{|
  default: lazyDoneComponentType,
|}>;

const preloadLazyComponents = {};
const storeChunkNames = [];

export const Suspense = ExecutionEnvironment.canUseEventListeners
  ? React.Suspense
  : ((): ComponentType<{| children: NodeType, fallback: NodeType |}> => {
      // TODO component should be ignored
      // eslint-disable-next-line require-jsdoc, flowtype/require-return-type
      const ServerSuspense = ({
        children,
      }: {|
        children: NodeType,
        fallback: NodeType,
      |}) => children;

      return ServerSuspense;
    })();

/**
 * Use special way to make React.lazy preload
 * https://github.com/facebook/react/blob/dfabb77a97141baf07cfdad620949874e36516d7/packages/react-reconciler/src/ReactFiberLazyComponent.js
 * https://github.com/facebook/react/blob/dfabb77a97141baf07cfdad620949874e36516d7/packages/shared/ReactLazyComponent.js
 *
 * @example
 * lazy(import('component'), 'component')
 *
 * @param {Promise} lazyComponent - dynamic import component
 * @param {string} chunkName - chunk name
 *
 * @return {Component} - lazy component
 */
export const lazy = (
  lazyComponent: lazyComponentType,
  chunkName: string,
): lazyDoneComponentType & {
  _status?: 0 | 1 | 2,
  _result?: ComponentType<*>,
} => {
  invariant(
    chunkName,
    '`chunk name` can not be null or undefined with ReactIsomorphic.lazy',
  );

  const Component = ExecutionEnvironment.canUseEventListeners
    ? React.lazy(lazyComponent)
    : ((): lazyDoneComponentType => {
        // TODO component should be ignored
        // eslint-disable-next-line require-jsdoc, flowtype/require-return-type
        const ServerLazy = (props: {}) => {
          if (!storeChunkNames.includes(chunkName))
            storeChunkNames.push(chunkName);

          return !ServerLazy._result
            ? null
            : React.createElement(ServerLazy._result, props);
        };

        return ServerLazy;
      })();

  if (Component._status !== 1) {
    Component._ctor = lazyComponent;
    preloadLazyComponents[chunkName] = Component;
  }

  return Component;
};

/**
 * @example
 * preload(['chunk name']);
 *
 * @param {Array} chunkNames - chunk names
 * @param {number} level - preload level
 *
 * @return {Promise} - null;
 */
export const preload = async (
  chunkNames?: $ReadOnlyArray<string> = [],
  level?: number = 0,
) => {
  if (chunkNames.length === 0) return;

  invariant(
    level <= 10,
    `Can not find those chunks: ${JSON.stringify(chunkNames)}`,
  );

  const newChunkNames = [];

  await Promise.all(
    chunkNames.map(async (chunkName: string) => {
      if (!preloadLazyComponents[chunkName]) {
        newChunkNames.push(chunkName);
        return;
      }

      if (preloadLazyComponents[chunkName]._status !== 1) {
        // TODO: https://github.com/eslint/eslint/issues/11899
        // eslint-disable-next-line require-atomic-updates
        preloadLazyComponents[chunkName]._result = (await preloadLazyComponents[
          chunkName
        ]._ctor()).default;
        // TODO: https://github.com/eslint/eslint/issues/11899
        // eslint-disable-next-line require-atomic-updates
        preloadLazyComponents[chunkName]._status = 1;
      }

      delete preloadLazyComponents[chunkName];
    }),
  );
  await preload(newChunkNames, level + 1);

  return;
};

/**
 * @example
 * hydrate(<div>test</div>, document.getElement('__CAT__'))
 *
 * @param {ReactNode} dom - react node to render
 * @param {HTMLELement} main - main dom to mount
 */
export const hydrate = async (dom: NodeType, main: HTMLElement) => {
  const chunkNames = window.__CHUNKS_NAMES__;

  await preload(chunkNames);
  reactClientRender(
    <>
      {dom}
      <script
        dangerouslySetInnerHTML={{
          __html: `var __CHUNKS_NAMES__ = ${JSON.stringify(chunkNames)};`,
        }}
      />
    </>,
    main,
  );
};

/**
 * @example
 * renderToNodeStream(<div>test</div>, stream);
 *
 * @param {ReactNode} dom - react node to render
 * @param {Stream} stream - node stream
 * @param {number} level - render level
 *
 * @return {Stream} - render stream
 */
export const renderToNodeStream = (
  dom: NodeType,
  {
    stream,
    reactServerRender,
  }: {| stream: streamType, reactServerRender: renderToNodeStreamType |},
  level?: number = 0,
) =>
  new Promise<$Call<ReadableType>>(resolve => {
    const exportStream = new stream.Readable({ read: () => {} });
    const renderStream = reactServerRender(dom);

    invariant(
      level <= 10,
      'Don not use too many `dynamic import` under other `dynamic import`. This is just an alternative plan before `react.lazy` support sever side rendering.',
    );

    renderStream.on('error', (e: Error) => {
      storeChunkNames.splice(0, storeChunkNames.length);
      resolve(exportStream);
      setTimeout(() => {
        exportStream.destroy(e);
      }, 100);
    });
    renderStream.on('data', (chunk: Buffer | string) => {
      exportStream.push(chunk);
    });
    renderStream.on('end', () => {
      const preloadChunkNames = Object.keys(preloadLazyComponents);

      if (preloadChunkNames.length === 0) {
        exportStream.push(
          `<script>var __CHUNKS_NAMES__ = ${JSON.stringify(
            storeChunkNames,
          )};</script>`,
        );
        exportStream.push(null);
        storeChunkNames.splice(0, storeChunkNames.length);

        resolve(exportStream);
      } else
        resolve(
          preload(preloadChunkNames).then(() =>
            renderToNodeStream(dom, { stream, reactServerRender }, level + 1),
          ),
        );
    });
  });
