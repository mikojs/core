// @flow

import memoizeOne from 'memoize-one';
import { areEqual } from 'fbjs';

import { type dndItemType, type dataType } from '../types';

export default memoizeOne(
  (
    components: dataType,
    previewer: dataType,
    current: dndItemType,
    target: dndItemType,
    hasPreviewComponent: boolean,
  ): ?dataType => {
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
      return null;

    return [
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
  },
  areEqual,
);
