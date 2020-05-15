// @flow

import { type ComponentType } from 'react';
import { Memo } from 'react-is';

type memoComponentType = ComponentType<*> & {|
  type: ComponentType<*>,
  $$typeof: string,
|};

/**
 * After `react-is@>=16.12`, `isMemo` is used to check the component which is created by react.createElement.
 *
 * @param {memoComponentType} Component - component type
 *
 * @return {boolean} - is the memo component
 */
const isMemo = (Component: memoComponentType) => Component?.$$typeof === Memo;

/**
 * @param {ComponentType} Component - component type
 *
 * @return {object} - the properties of the component
 */
export default (Component: ComponentType<*>) =>
  // $FlowFixMe FIXME: https://github.com/facebook/flow/issues/8145
  !isMemo(Component) ? Component : Component.type;
