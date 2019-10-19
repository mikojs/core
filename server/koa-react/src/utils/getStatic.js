// @flow

import { type ComponentType } from 'react';
import { isMemo } from 'react-is';

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
