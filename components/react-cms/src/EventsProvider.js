// @flow

import React, { type Node as NodeType } from 'react';
import { emptyFunction } from 'fbjs';

type propsType = {|
  children: NodeType,
|};

export type contextType = {|
  move: () => void,
|};

export const EventsContext = React.createContext<contextType>({
  move: emptyFunction,
});

/** @react Use to control the all events of cms */
const EventsProvider = ({ children }: propsType): NodeType => {
  const move = emptyFunction;

  return (
    <EventsContext.Provider value={{ move }}>{children}</EventsContext.Provider>
  );
};

export default React.memo<propsType>(EventsProvider);
