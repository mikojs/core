// @flow

import React, { type Node as NodeType, type ComponentType } from 'react';
import * as d3 from 'd3-hierarchy';
import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';

import { type kindType, type dataType, type contextType } from './types';
import Previewer from './Previewer';

import initializeComponents from './utils/initializeComponents';

type propsType = {|
  components: $ReadOnlyArray<ComponentType<*>>,
  children: NodeType,
|};

type stateType = {|
  components: dataType,
  previewer: dataType,
|};

const DEFAULT_PREVIEWER = [
  {
    id: 'previewer',
    parentId: null,
    kind: 'previewer',
    type: Previewer,
  },
];

const parse = d3
  .stratify()
  .id(({ id }: {| id: string |}) => id)
  .parentId(({ parentId }: {| parentId: string |}) => parentId);

export const DataContext = React.createContext<contextType>({
  manager: parse(initializeComponents([])),
  previewer: parse(DEFAULT_PREVIEWER),
  handler: emptyFunction,
});

/** Provide the source data and the methods to handle the source data*/
export default class Provider extends React.PureComponent<
  propsType,
  stateType,
> {
  state = {
    components: initializeComponents(this.props.components),
    previewer: DEFAULT_PREVIEWER,
  };

  +handler = memoizeOne(
    (kind: kindType, draggedId: string, targetId: string) => {
      const { components, previewer } = this.state;

      switch (kind) {
        case 'new-component': {
          const draggedIndex = components.findIndex(
            ({
              id,
            }: $ElementType<$PropertyType<stateType, 'previewer'>, number>) =>
              id === draggedId,
          );
          const targetIndex = previewer.findIndex(
            ({
              id,
            }: $ElementType<$PropertyType<stateType, 'previewer'>, number>) =>
              id === targetId,
          );

          if (
            targetIndex === -1 ||
            !['previewer', 'component'].includes(previewer[targetIndex].kind)
          )
            break;

          this.setState({
            previewer: [
              ...previewer.filter(
                ({ kind: prevKind }: $ElementType<dataType, number>) =>
                  prevKind !== 'new-component',
              ),
              {
                ...components[draggedIndex],
                parentId: targetId,
              },
            ],
          });
          break;
        }

        case 'manager':
        case 'previewer':
        case 'component':
          break;

        default:
          throw new Error(`Can not find ${kind} type`);
      }
    },
  );

  /** @react */
  render(): NodeType {
    const { children } = this.props;
    const { components, previewer } = this.state;

    return (
      <DataContext.Provider
        value={{
          manager: parse(components),
          previewer: parse(previewer),
          handler: this.handler,
        }}
      >
        {children}
      </DataContext.Provider>
    );
  }
}
