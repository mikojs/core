// @flow

import { useReducer } from 'react';

export type sourceType = $ReadOnlyArray<{}>;

export type itemType = {|
  id: string,
  type: 'component',
|};

type updateSourceOptionType = 'drop' | 'hover';

/**
 * @example
 * sourceReducer(prevState, { type: 'add', current: { id: 'id', kind: 'component' } })
 *
 * @param {sourceType} state - prevState of the source data
 * @param {object} action - action to trigger the reducer
 *
 * @return {sourceType} - new state of the source data
 */
const sourceReducer = (
  state: sourceType,
  {
    type,
    current,
    target,
  }: {|
    type: 'TODO',
    current: itemType,
    target: itemType,
  |},
): sourceType => {
  switch (type) {
    default:
      throw new Error(`Can not find the ${type}`);
  }
};

/**
 * @example
 * getUpdateType('drop', current, target)
 *
 * @param {updateSourceOptionType} type - the originial type of updating the source
 * @param {itemType} current - the current item
 * @param {itemType} target - the target item
 *
 * @return {string} - the type of updating the source
 */
const getUpdateType = (
  type: updateSourceOptionType,
  current: itemType,
  target: itemType,
) => 'TODO';

/**
 * @example
 * useSource([])
 *
 * @param {sourceType} initialSource - the initial source
 *
 * @return {object} - the source data and the methods to modify the source
 */
export default (
  initialSource: sourceType,
): {|
  source: sourceType,
  updateSource: (
    type: updateSourceOptionType,
    current: itemType,
    target: itemType,
  ) => void,
|} => {
  const [source, sourceDispatch] = useReducer(sourceReducer, initialSource);

  return {
    source,
    updateSource: (
      type: updateSourceOptionType,
      current: itemType,
      target: itemType,
    ) =>
      sourceDispatch({
        type: getUpdateType(type, current, target),
        current,
        target,
      }),
  };
};
