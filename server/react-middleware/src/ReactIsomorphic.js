// @flow
// TODO: remove after react.lazy support server side

import React, { type Node as NodeType, type ComponentType } from 'react';
import { hydrate as reactClientRender } from 'react-dom';
import { renderToNodeStream as reactServerRender } from 'react-dom/server';
import { invariant, ExecutionEnvironment } from 'fbjs';

const preloadLazyComponents = {};

type lazyDoneComponentType = ComponentType<*>;
export type lazyComponentType = () => Promise<{
  default: lazyDoneComponentType,
}>;

export const Suspense = ExecutionEnvironment.canUseEventListeners
  ? React.Suspense
  : ((): ComponentType<{ children: NodeType }> => {
      // TODO component should be ignored
      // eslint-disable-next-line require-jsdoc, flowtype/require-return-type
      const ServerSuspense = ({ children }: { children: NodeType }) => children;

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
): lazyDoneComponentType => {
  invariant(
    chunkName,
    '`chunk name` can not be null or undefined with ReactIsomorphic.lazy',
  );

  const Component = ExecutionEnvironment.canUseEventListeners
    ? React.lazy(lazyComponent)
    : ((): lazyDoneComponentType => {
        // TODO component should be ignored
        // eslint-disable-next-line require-jsdoc, flowtype/require-return-type
        const ServerLazy = (props: {}) =>
          !ServerLazy._result
            ? null
            : React.createElement(ServerLazy._result, props);

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
const preload = (chunkNames: $ReadOnlyArray<string>, level?: number = 0) =>
  Promise.all(
    chunkNames.map(
      async (chunkName: string): ?string => {
        if (!preloadLazyComponents[chunkName]) return chunkName;
        if (preloadLazyComponents[chunkName]._status !== 1) {
          preloadLazyComponents[
            chunkName
          ]._result = (await preloadLazyComponents[chunkName]._ctor()).default;
          preloadLazyComponents[chunkName]._status = 1;
        }

        delete preloadLazyComponents[chunkName];

        return null;
      },
    ),
  ).then(
    (
      resultChunkNames: $ReadOnlyArray<?string>,
    ): $Call<preload, $ReadOnlyArray<string>> => {
      if (level > 10)
        throw new Error(
          `Can not find those chunks: ${JSON.stringify(chunkNames)}`,
        );

      const newChunkNames = resultChunkNames.filter(
        (chunkName: ?string) => chunkName,
      );

      return newChunkNames.length === 0
        ? null
        : preload(newChunkNames, level + 1);
    },
  );

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

// TODO: fix update
/**
 * @example
 * renderToNodeStream(<div>test</div>);
 *
 * @param {ReactNode} dom - react node to render
 * @param {number} level - render level
 * @param {Array} chunkNames - chunk names to hydrate
 *
 * @return {Stream} - render stream
 */
export const renderToNodeStream = (
  dom: NodeType,
  level?: number = 0,
  chunkNames?: $ReadOnlyArray<string> = [],
) =>
  new Promise(resolve => {
    const stream = require('stream');
    const exportStream = new stream.Readable({ read: () => {} });
    const renderStream = reactServerRender(dom);

    renderStream.on('readable', () => {
      renderStream.read();
    });
    renderStream.on('data', (chunk: Buffer | string) => {
      exportStream.push(chunk);
    });
    renderStream.on('error', (error: Error) => {
      exportStream.destroy(error);
    });
    renderStream.on('end', () => {
      const preloadChunkNames = Object.keys(preloadLazyComponents);

      if (preloadChunkNames.length === 0) {
        exportStream.push(
          `<script>var __CHUNKS_NAMES__ = ${JSON.stringify(
            chunkNames,
          )};</script>`,
        );
        exportStream.push(null);

        resolve(exportStream);
      } else {
        // TODO: don not close server
        if (level > 10)
          exportStream.destroy(
            new Error(
              'Don not use too many `dynamic import` under other `dynamic import`. This is just an alternative plan before `react.lazy` support sever side rendering.',
            ),
          );
        else
          resolve(
            preload(preloadChunkNames).then(() =>
              renderToNodeStream(dom, level + 1, [
                ...chunkNames,
                ...preloadChunkNames,
              ]),
            ),
          );
      }
    });
  });
