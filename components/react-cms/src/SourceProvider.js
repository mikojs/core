// @flow

import React, { useReducer, type Node as NodeType } from 'react';
import { emptyFunction } from 'fbjs';

export type itemType = {|
  id: string,
  kind: 'component',
|};

type actionType = {|
  type: 'TODO',
  current: itemType,
|};

type contextType = {|
  source: $ReadOnlyArray<{}>,
  updateSource: (
    type: $PropertyType<actionType, 'type'>,
    current: $PropertyType<actionType, 'current'>,
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
 * sourceReducer(prevState, { type: 'add', current: { id: 'id', kind: 'component' } });
 *
 * @param {contextType.source} state - prevState of the source data
 * @param {actionType} action - action to trigger the reducer
 *
 * @return {contextType.source} - new state of the source data
 */
const sourceReducer = (
  state: $PropertyType<contextType, 'source'>,
  { type, current }: actionType,
): $PropertyType<contextType, 'source'> => {
  switch (type) {
    default:
      throw new Error(`Can not find the ${type}`);
  }
};

/** @react Provide the source data and the methods to handle the source data */
const SourceProvider = ({ children, initialSource }: propsType): NodeType => {
  const [source, sourceDispatch] = useReducer(sourceReducer, initialSource);

  return (
    <SourceContext.Provider
      value={{
        source,
        updateSource: (
          type: $PropertyType<actionType, 'type'>,
          current: $PropertyType<actionType, 'current'>,
        ) => sourceDispatch({ type, current }),
      }}
    >
      {children}
    </SourceContext.Provider>
  );
};

export default React.memo<propsType>(SourceProvider);
