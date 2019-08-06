// @flow

import React, { type Node as NodeType } from 'react';
import * as d3 from 'd3-hierarchy';

import { type dataType, type contextType } from './types';
import Previewer from './Previewer';

type propsType = {|
  children: NodeType,
|};

type stateType = {|
  previewer: dataType,
|};

const DEFAULT_PREVIEWER = [
  {
    id: 'root',
    parentId: null,
    dndType: 'previewer',
    type: Previewer,
  },
];

const parse = d3
  .stratify()
  .id(({ id }: {| id: string |}) => id)
  .parentId(({ parentId }: {| parentId: string |}) => parentId);

export const DataContext = React.createContext<contextType>({
  previewer: parse(DEFAULT_PREVIEWER),
});

/** Provide the source data and the methods to handle the source data*/
export default class Provider extends React.PureComponent<
  propsType,
  stateType,
> {
  state = {
    previewer: DEFAULT_PREVIEWER,
  };

  /** @react */
  render(): NodeType {
    const { children } = this.props;
    const { previewer } = this.state;

    return (
      <DataContext.Provider value={{ previewer: parse(previewer) }}>
        {children}
      </DataContext.Provider>
    );
  }
}
