// @flow

import React, { useReducer, type Node as NodeType } from 'react';
import { emptyFunction } from 'fbjs';

export type itemType = {|
  id: string,
  type: 'component',
|};

type actionType = {|
  type: 'TODO',
  current: itemType,
  target: itemType,
|};

type updateSourceOptionType = 'drop' | 'hover';

type contextType = {|
  source: $ReadOnlyArray<{}>,
  updateSource: (
    type: updateSourceOptionType,
    current: $PropertyType<actionType, 'current'>,
    target: $PropertyType<actionType, 'target'>,
  ) => void,
|};

type propsType = {|
  children: NodeType,
  initialSource: $PropertyType<contextType, 'source'>,
|};

export const SourceContext = React.createContext<contextType>({
  source: [],
  updateSource: emptyFunction,
});

/**
 * @example
 * sourceReducer(prevState, { type: 'add', current: { id: 'id', kind: 'component' } })
 *
 * @param {contextType.source} state - prevState of the source data
 * @param {actionType} action - action to trigger the reducer
 *
 * @return {contextType.source} - new state of the source data
 */
const sourceReducer = (
  state: $PropertyType<contextType, 'source'>,
  { type, current, target }: actionType,
): $PropertyType<contextType, 'source'> => {
  switch (type) {
    default:
      throw new Error(`Can not find the ${type}`);
  }
};

/**
 * @example
 * getUpdateType('drop', { id: 'id', kind: 'component' }, { id: 'id', kind: 'component' })
 *
 * @param {updateSourceOptionType} type - the type of updating the source
 * @param {actionType.current} current - the current item
 * @param {actionType.target} target - the target item
 *
 * @return {actionType.type} - the type of updating the source
 */
const getUpdateType = (
  type: updateSourceOptionType,
  current: $PropertyType<actionType, 'current'>,
  target: $PropertyType<actionType, 'target'>,
) => 'TODO';

/** @react Provide the source data and the methods to handle the source data */
const SourceProvider = ({ children, initialSource }: propsType): NodeType => {
  const [source, sourceDispatch] = useReducer(sourceReducer, initialSource);

  return (
    <SourceContext.Provider
      value={{
        source,
        updateSource: (
          type: updateSourceOptionType,
          current: $PropertyType<actionType, 'current'>,
          target: $PropertyType<actionType, 'target'>,
        ) =>
          sourceDispatch({
            type: getUpdateType(type, current, target),
            current,
            target,
          }),
      }}
    >
      {children}
    </SourceContext.Provider>
  );
};

export default React.memo<propsType>(SourceProvider);
