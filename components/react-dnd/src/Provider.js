// @flow

import React, { type Node as NodeType, type ComponentType } from 'react';
import * as d3 from 'd3-hierarchy';
import memoizeOne from 'memoize-one';
import { emptyFunction, areEqual } from 'fbjs';
import uuid from 'uuid/v4';

import { type dndItemType, type dataType, type contextType } from './types';
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
  hover: emptyFunction,
  drop: emptyFunction,
});

/** Provide the source data and the methods to handle the source data*/
export default class Provider extends React.PureComponent<
  propsType,
  stateType,
> {
  hasPreviewComponent = false;

  state = {
    components: initializeComponents(this.props.components),
    previewer: DEFAULT_PREVIEWER,
  };

  +hover = memoizeOne((current: dndItemType, target: dndItemType) => {
    const { components, previewer } = this.state;

    if (current.type === 'new-component') {
      switch (target.type) {
        case 'manager':
          if (!this.hasPreviewComponent) return;

          this.hasPreviewComponent = false;
          this.setState({
            previewer: previewer.filter(
              ({ kind }: $ElementType<dataType, number>) =>
                kind !== 'preview-component',
            ),
          });
          return;

        case 'previewer': {
          const draggedIndex = components.findIndex(
            ({ id }: $ElementType<dataType, number>) => id === current.id,
          );
          const targetIndex = previewer.findIndex(
            ({ id }: $ElementType<dataType, number>) => id === target.id,
          );

          if (
            targetIndex === -1 ||
            !['previewer', 'component'].includes(previewer[targetIndex].kind)
          )
            return;

          const newPreviewer = [
            ...(!this.hasPreviewComponent
              ? previewer
              : previewer.filter(
                  ({ kind }: $ElementType<dataType, number>) =>
                    kind !== 'preview-component',
                )),
            {
              ...components[draggedIndex],
              kind: 'preview-component',
              parentId: target.id,
            },
          ];

          this.hasPreviewComponent = true;
          this.setState({
            previewer: newPreviewer,
          });
          return;
        }

        default:
          return;
      }
    }
  }, areEqual);

  /**
   * @example
   * drop(current, target)
   *
   * @param {dndItemType} current - current dnd item
   * @param {dndItemType} target - target dnd item
   */
  +drop = (current: dndItemType, target: dndItemType) => {
    const { previewer } = this.state;

    if (current.type === 'new-component' && target.type === 'previewer') {
      this.hasPreviewComponent = false;
      this.setState({
        previewer: previewer.map((data: $ElementType<dataType, number>) =>
          data.kind !== 'preview-component'
            ? data
            : {
                ...data,
                id: uuid(),
                kind: 'component',
              },
        ),
      });
    } else if (current.type === 'component' && target.type === 'manager')
      this.setState({
        previewer: previewer.filter(
          (data: $ElementType<dataType, number>) => data.id !== current.id,
        ),
      });
  };

  /** @react */
  render(): NodeType {
    const { children } = this.props;
    const { components, previewer } = this.state;

    return (
      <DataContext.Provider
        value={{
          manager: parse(components),
          previewer: parse(previewer),
          hover: this.hover,
          drop: this.drop,
        }}
      >
        {children}
      </DataContext.Provider>
    );
  }
}
