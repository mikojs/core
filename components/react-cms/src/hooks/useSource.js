// @flow

import { useMemo, useReducer, type ComponentType } from 'react';
import memoizeOne from 'memoize-one';
import { areEqual } from 'fbjs';
import uuid from 'uuid/v4';

export type itemType = {|
  id: string,
  type:
    | 'none'
    | 'only-drag'
    | 'only-drop-to-add'
    | 'only-drop-to-remove'
    | 'drag-and-drop',
  component: string | ComponentType<*>,
  getProps?: () => {},
|};

export type sourceType = $ReadOnlyArray<{|
  ...itemType,
  parentId: string | null,
|}>;

export type actionType = 'drop' | 'hover';

type stateType = {|
  previewId: false | string,
  source: sourceType,
|};

/**
 * @example
 * getUpdateType('drop', current, target)
 *
 * @param {actionType} type - the originial type of updating the source
 * @param {itemType} current - the current item
 * @param {itemType} target - the target item
 *
 * @return {string} - the type of updating the source
 */
const getUpdateType = (
  type: actionType,
  current: itemType,
  target: itemType,
): 'none' | 'add-preview-component' | 'add-component' | 'remove-component' => {
  if (
    ['only-drop-to-add', 'only-drop-to-remove', 'none'].includes(
      current.type,
    ) ||
    ['only-drag', 'none'].includes(target.type)
  )
    return 'none';

  if (type === 'hover') return 'add-preview-component';

  if (target.type === 'only-drop-to-remove') return 'remove-component';

  return 'add-component';
};

/**
 * @example
 * sourceReducer(prevState, { type: 'add', current: current, target: target } })
 *
 * @param {stateType} state - the prevState of the source data
 * @param {object} action - the action data to trigger the reducer
 *
 * @return {stateType} - the new state of the source data
 */
const sourceReducer = (
  { previewId, source }: stateType,
  {
    type,
    current,
    target,
  }: {|
    type: actionType,
    current: itemType,
    target: itemType,
  |},
): stateType => {
  switch (getUpdateType(type, current, target)) {
    case 'add-preview-component': {
      if (!previewId) {
        const id = uuid();

        return {
          previewId: id,
          source: [
            ...source,
            {
              ...current,
              id,
              parentId: target.id,
              type: 'only-drop-to-add',
            },
          ],
        };
      }

      const newSource = [...source];
      const preview = newSource.find(
        ({ id }: $ElementType<sourceType, number>) => id === current.id,
      );

      if (preview) preview.parentId = target.id;

      return {
        previewId,
        source: newSource,
      };
    }

    case 'add-component':
      return {
        previewId: false,
        source: source.map(
          ({
            id,
            type: currentType,
            ...data
          }: $ElementType<sourceType, number>) => ({
            ...data,
            id,
            type: id !== previewId ? currentType : 'drag-and-drop',
          }),
        ),
      };

    case 'remove-component':
      return {
        previewId,
        source: source.filter(
          ({ id }: $ElementType<sourceType, number>) => id !== current.id,
        ),
      };

    default:
      return {
        previewId,
        source,
      };
  }
};

/**
 * @example
 * useSource([])
 *
 * @param {sourceType} initialSource - the initial source
 *
 * @return {object} - the source data and the methods to modify the source
 */
const useSource = (
  initialSource: sourceType,
): {|
  source: sourceType,
  updateSource: (action: {|
    type: actionType,
    current: itemType,
    target: itemType,
  |}) => void,
|} => {
  const [{ source }, sourceDispatch] = useReducer(sourceReducer, {
    previewId: false,
    source: initialSource,
  });
  const updateSource = useMemo(() => memoizeOne(sourceDispatch, areEqual), []);

  return {
    source,
    updateSource,
  };
};

export default useSource;
