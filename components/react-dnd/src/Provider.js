// @flow

import React, { type Node as NodeType } from 'react';
import * as d3 from 'd3-hierarchy';
import { emptyFunction } from 'fbjs';

import { type propsType as previewerPropsType } from './Previewer';

type propsType = {|
  children: NodeType,
|};

type stateType = {|
  data: $ReadOnlyArray<
    $PropertyType<$PropertyType<previewerPropsType, 'source'>, 'data'> & {
      id: string,
      parentId?: string | null,
    },
  >,
|};

const parse = d3
  .stratify()
  .id(({ id }: {| id: string |}) => id)
  .parentId(({ parentId }: {| parentId: string |}) => parentId);

const DEFAULT_DATA = [
  {
    id: 'root',
    type: 'div',
  },
];

export const DataContext = React.createContext<previewerPropsType>({
  source: parse(DEFAULT_DATA),
  handler: emptyFunction,
});

/** Use to provide the source data */
export default class Provider extends React.PureComponent<
  propsType,
  stateType,
> {
  state = {
    data: DEFAULT_DATA,
  };

  /**
   * @example
   * provider.handler(draggedId, targetId)
   *
   * @param {string} draggedId - the id of the dragged DOM
   * @param {string} targetId - the id of the target DOM
   */
  +handler = (draggedId: string, targetId: string) => {
    const data = [...this.state.data];
    const draggedIndex = data.findIndex(
      ({ id }: $ElementType<$PropertyType<stateType, 'data'>, number>) =>
        id === draggedId,
    );
    const targetIndex = data.findIndex(
      ({ id }: $ElementType<$PropertyType<stateType, 'data'>, number>) =>
        id === targetId,
    );
    const draggedDOM = data[draggedIndex];
    const targetDOM = data[targetIndex];

    data[targetIndex] = {
      ...draggedDOM,
      parentId: targetDOM.parentId || null,
    };
    data[draggedIndex] = {
      ...targetDOM,
      parentId: draggedDOM.parentId || null,
    };

    this.setState({ data });
  };

  /** @react */
  render(): NodeType {
    const { children } = this.props;
    const { data } = this.state;

    return (
      <DataContext.Provider
        value={{ source: parse(data), handler: this.handler }}
      >
        {children}
      </DataContext.Provider>
    );
  }
}
