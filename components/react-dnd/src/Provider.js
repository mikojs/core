// @flow

import React, { type Node as NodeType } from 'react';
import * as d3 from 'd3-hierarchy';

import { type sourceType } from './Previewer';

export type contextType = {|
  source: sourceType,
|};

type propsType = {|
  children: NodeType,
|};

type stateType = {|
  source: $PropertyType<contextType, 'source'>,
|};

const parse = d3
  .stratify()
  .id(({ id }: {| id: string |}) => id)
  .parentId(({ parentId }: {| parentId: string |}) => parentId);

const defaultSource = parse([
  {
    id: 'root',
    type: 'div',
    props: {
      children: 'Root',
    },
  },
]);

export const DataContext = React.createContext<contextType>({
  source: defaultSource,
});

/** Use to provide the source data */
export default class Provider extends React.PureComponent<
  propsType,
  stateType,
> {
  state = {
    source: defaultSource,
  };

  /** @react */
  render(): NodeType {
    const { children } = this.props;
    const { source } = this.state;

    return (
      <DataContext.Provider value={{ source }}>{children}</DataContext.Provider>
    );
  }
}
