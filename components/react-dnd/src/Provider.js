// @flow

import React, { type Node as NodeType, type ComponentType } from 'react';
import * as d3 from 'd3-hierarchy';
import memoizeOne from 'memoize-one';
import { emptyFunction } from 'fbjs';
import uuid from 'uuid/v4';

import { type dataType, type contextType } from './types';
import Previewer from './Previewer';

import initializeComponents, {
  DEFAULT_MANAGER,
} from './utils/initializeComponents';

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
    dndType: 'previewer',
    type: Previewer,
  },
];

const parse = d3
  .stratify()
  .id(({ id }: {| id: string |}) => id)
  .parentId(({ parentId }: {| parentId: string |}) => parentId);

export const DataContext = React.createContext<contextType>({
  manager: parse(DEFAULT_MANAGER),
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
    (dndType: string, draggedId: string, targetId: string) => {
      const { components, previewer } = this.state;

      switch (dndType) {
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
            !['previewer', 'component'].includes(previewer[targetIndex].dndType)
          )
            break;

          const data = [...previewer];

          data.push({
            ...components[draggedIndex],
            id: uuid(),
            parentId: targetId,
            dndType: 'component',
          });

          this.setState({ previewer: data });
          break;
        }

        case 'manager':
        case 'previewer':
        case 'component':
          break;

        default:
          throw new Error(`Can not find ${dndType} type`);
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
