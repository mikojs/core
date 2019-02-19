// @flow
// TODO: remove after react.lazy support server side

import React, { type Node as NodeType, type ComponentType } from 'react';
import { invariant, ExecutionEnvironment } from 'fbjs';

const preloadLazyComponents = {};

export type lazyComponentType = () => Promise<{ default: ComponentType<*> }>;

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
): ComponentType<*> => {
  invariant(
    chunkName,
    '`chunk name` can not be null or undefined with ReactIsomorphic.lazy',
  );

  if (ExecutionEnvironment.canUseEventListeners)
    return React.lazy(lazyComponent);

  if (!lazyComponent._result) preloadLazyComponents[chunkName] = lazyComponent;

  // TODO component should be ignored
  // eslint-disable-next-line require-jsdoc, flowtype/require-return-type
  const ServerLazy = (props: {}) =>
    React.createElement(lazyComponent._result, props);

  return ServerLazy;
};

/**
 * @example
 * preloadAll()
 *
 * @return {Promise} - preload all lazy components
 */
export const preloadAll = () =>
  Promise.all(
    Object.keys(preloadLazyComponents).map(async (chunkName: string) => {
      const { default: Component } = await preloadLazyComponents[chunkName]();

      preloadLazyComponents[chunkName]._result = Component;

      delete preloadLazyComponents[chunkName];
    }),
  ).then(() =>
    Object.keys(preloadLazyComponents).length === 0 ? null : preloadAll(),
  );
