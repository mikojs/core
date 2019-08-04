// @flow

import React, { type Node as NodeType } from 'react';
import * as d3 from 'd3-hierarchy';

import { type dataType, type contextType } from './types';

type propsType = {|
  children: NodeType,
|};

type stateType = {|
  data: dataType,
|};

const DEFAULT_DATA = [
  {
    id: 'root',
    parentId: null,
    type: 'root',
  },
];

const parse = d3
  .stratify()
  .id(({ id }: {| id: string |}) => id)
  .parentId(({ parentId }: {| parentId: string |}) => parentId);

export const DataContext = React.createContext<contextType>({
  source: parse(DEFAULT_DATA),
});

/** Provide the source data and the methods to handle the source data*/
export default class Provider extends React.PureComponent<
  propsType,
  stateType,
> {
  state = {
    data: DEFAULT_DATA,
  };

  /** @react */
  render(): NodeType {
    const { children } = this.props;
    const { data } = this.state;

    return (
      <DataContext.Provider value={{ source: parse(data) }}>
        {children}
      </DataContext.Provider>
    );
  }
}
