// @flow

import { type ComponentType } from 'react';
import { Memo } from 'react-is';
import hoistNonReactStatics from 'hoist-non-react-statics';

type memoComponentType = ComponentType<*> & {|
  type: ComponentType<*>,
  $$typeof: string,
|};

/**
 * After `react-is@>=16.12`, `isMemo` is used to check the component which is created by react.createElement.
 *
 * @example
 * isMemo(Component)
 *
 * @param {memoComponentType} Component - component type
 *
 * @return {boolean} - is the memo component
 */
const isMemo = (Component: memoComponentType) => Component?.$$typeof === Memo;

/**
 * @example
 * hoistNonReactStaticsHotExported(Component, false)
 *
 * @param {memoComponentType} Component - component type
 * @param {boolean} isDev - is dev or not
 *
 * @return {memoComponentType} - component which has been hoisted
 */
export const hoistNonReactStaticsHotExported = (
  Component: memoComponentType,
  isDev: boolean,
): memoComponentType => {
  // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/8145
  if (isMemo(Component) && isDev)
    // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/8145
    hoistNonReactStatics(Component, Component.type);

  return Component;
};

/**
 * @example
 * getStatic(Component)
 *
 * @param {ComponentType} Component - component type
 *
 * @return {object} - the properties of the component
 */
export default (Component: ComponentType<*>) =>
  // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/8145
  !isMemo(Component) ? Component : Component.type || Component;
