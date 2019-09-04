// @flow

import React, { useState, type Node as NodeType } from 'react';
import * as d3 from 'd3-hierarchy';
import memoizeOne from 'memoize-one';
import { emptyFunction, areEqual } from 'fbjs';
import uuid from 'uuid/v4';

import { type dndItemType, type dataType, type contextType } from './types';
import Previewer from './Previewer';

import initializeComponents, {
  type initializeComponentsType,
} from './utils/initializeComponents';

type propsType = {|
  components: initializeComponentsType,
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
    icon: emptyFunction,
  },
];
let hasPreviewComponent: boolean = false;

export const parse = d3
  .stratify()
  .id(({ id }: {| id: string |}) => id)
  .parentId(({ parentId }: {| parentId: string |}) => parentId);

export const DataContext = React.createContext<contextType>({
  manager: parse(initializeComponents([])),
  previewer: parse(DEFAULT_PREVIEWER),
  hover: emptyFunction,
  drop: emptyFunction,
});

export const getHover = memoizeOne(
  (
    components: $PropertyType<stateType, 'components'>,
    previewer: $PropertyType<stateType, 'previewer'>,
    setPreviewer: (previewer: $PropertyType<stateType, 'previewer'>) => void,
  ) =>
    memoizeOne((current: dndItemType, target: dndItemType) => {
      if (current.type === 'new-component') {
        switch (target.type) {
          case 'manager':
            if (!hasPreviewComponent) return;

            hasPreviewComponent = false;
            setPreviewer(
              previewer.filter(
                ({ kind }: $ElementType<dataType, number>) =>
                  kind !== 'preview-component',
              ),
            );
            return;

          case 'previewer': {
            const draggedIndex = components.findIndex(
              ({ id }: $ElementType<dataType, number>) => id === current.id,
            );
            const targetIndex = previewer.findIndex(
              ({ id }: $ElementType<dataType, number>) => id === target.id,
            );

            if (
              draggedIndex === -1 ||
              targetIndex === -1 ||
              !['previewer', 'component'].includes(previewer[targetIndex].kind)
            )
              return;

            const newPreviewer = [
              ...(!hasPreviewComponent
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

            hasPreviewComponent = true;
            setPreviewer(newPreviewer);
            return;
          }

          default:
            return;
        }
      }
    }, areEqual),
  areEqual,
);

export const getDrop = memoizeOne(
  (
    previewer: $PropertyType<stateType, 'previewer'>,
    setPreviewer: (previewer: $PropertyType<stateType, 'previewer'>) => void,
  ) => (current: dndItemType, target: dndItemType) => {
    if (current.type === 'new-component' && target.type === 'previewer') {
      hasPreviewComponent = false;

      setPreviewer(
        previewer.map((data: $ElementType<dataType, number>) =>
          data.kind !== 'preview-component'
            ? data
            : {
                ...data,
                id: uuid(),
                kind: 'component',
              },
        ),
      );
    } else if (current.type === 'component' && target.type === 'manager')
      setPreviewer(
        previewer.filter(
          (data: $ElementType<dataType, number>) => data.id !== current.id,
        ),
      );
  },
  areEqual,
);

/** @react Provide the source data and the methods to handle the source data*/
const Provider = ({
  children,
  components: initComponents,
}: propsType): NodeType => {
  const [components] = useState(initializeComponents(initComponents));
  const [previewer, setPreviewer] = useState(DEFAULT_PREVIEWER);

  return (
    <DataContext.Provider
      value={{
        manager: parse(components),
        previewer: parse(previewer),
        hover: getHover(components, previewer, setPreviewer),
        drop: getDrop(previewer, setPreviewer),
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default React.memo<propsType>(Provider);
