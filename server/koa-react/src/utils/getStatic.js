// @flow

import { type ComponentType } from 'react';
import { Memo } from 'react-is';

/**
 * After `react-is@>=16.12`, `isMemo` is used to check the component which is created by react.createElement.
 *
 * @example
 * isMemo(Component)
 *
 * @param {ComponentType} Component - component type
 *
 * @return {boolean} - is the memo component
 */
export const isMemo = (Component: ComponentType<*> & {| $$typeof: string |}) =>
  Component?.$$typeof === Memo;

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
  !isMemo(Component) ? Component : Component.type;
