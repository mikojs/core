// @flow
// TODO: remove after react.lazy support server side

import React, { type Node as NodeType, type ComponentType } from 'react';
import { ExecutionEnvironment } from 'fbjs';

const lazyComponents = {};
const components = {};

export type lazyComponentType = () => Promise<{ default: ComponentType<*> }>;

export const Suspense = ExecutionEnvironment.canUseEventListeners
  ? React.Suspense
  : ({ children }: { children: NodeType }) => children;

/**
 * @example
 * lazy(import('component'), 'component')
 *
 * @param {Promise} lazyComponent - dynamic import component
 * @param {string} moduleId - module id
 *
 * @return {Component} - lazy component
 */
export const lazy = (
  lazyComponent: lazyComponentType,
  moduleId: string,
): ComponentType<*> => {
  if (ExecutionEnvironment.canUseEventListeners)
    return React.lazy(lazyComponent);

  lazyComponents[moduleId] = lazyComponent;

  return (props: mixed): NodeType => {
    const Component = components[moduleId];

    return <Component {...props} />;
  };
};

/**
 * @example
 * preloadAll()
 *
 * @return {Promise} - preload all lazy components
 */
export const preloadAll = () =>
  Promise.all(
    Object.keys(lazyComponents).map(async (moduleId: string) => {
      const { default: Component } = await lazyComponents[moduleId]();

      delete lazyComponents[moduleId];

      components[moduleId] = Component;
    }),
  );
