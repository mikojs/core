// @flow

import React, {
  useRef,
  useImperativeHandle,
  type ComponentType,
  type Node as NodeType,
} from 'react';
import { DndProvider, DndContext } from 'react-dnd-cjs';
import TestBackend from 'react-dnd-test-backend-cjs';

// TODO: https://github.com/react-dnd/react-dnd/issues/1506
/**
 * @example
 * wrapInTestContext(() => <div />)
 *
 * @param {ComponentType} Component - wrapper Component
 *
 * @return {NodeType} - testing Component
 */
export const wrapInTestContext = (Component: ComponentType<*>) =>
  React.forwardRef<{}, { getManager: () => mixed }>(
    (
      props: {},
      ref:
        | { current: null | { getManager: () => mixed }, ... }
        | ((null | { getManager: () => mixed }) => mixed),
    ): NodeType => {
      const dragDropManager = useRef<mixed>();

      useImperativeHandle<{ getManager: () => mixed }>(ref, () => ({
        getManager: () => dragDropManager.current,
      }));

      return (
        <DndProvider backend={TestBackend}>
          <DndContext.Consumer>
            {(context: {| dragDropManager: mixed |}) => {
              dragDropManager.current = context.dragDropManager;
            }}
          </DndContext.Consumer>

          <Component {...props} />
        </DndProvider>
      );
    },
  );

/**
 * @example
 * reactDndTestUtilsCjs()
 */
export default () => {
  throw new Error('Not use');
};
