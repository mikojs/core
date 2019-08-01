// @flow

import React, { type Node as NodeType } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as d3 from 'd3-hierarchy';
import memoizeOne from 'memoize-one';
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

export type contextType = {|
  source: $PropertyType<previewerPropsType, 'source'>,
  move: $PropertyType<previewerPropsType, 'handler'>,
  add: $PropertyType<previewerPropsType, 'handler'>,
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

export const DataContext = React.createContext<contextType>({
  source: parse(DEFAULT_DATA),
  move: emptyFunction,
  add: emptyFunction,
});

/** Use to provide the source data */
export default class Provider extends React.PureComponent<
  propsType,
  stateType,
> {
  state = {
    data: DEFAULT_DATA,
  };

  +move = memoizeOne((draggedId: string, targetId: string) => {
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
  });

  +add = memoizeOne((draggedId: string, targetId: string) => {});

  /** @react */
  render(): NodeType {
    const { children } = this.props;
    const { data } = this.state;

    return (
      <DataContext.Provider
        value={{ source: parse(data), move: this.move, add: this.add }}
      >
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
      </DataContext.Provider>
    );
  }
}
