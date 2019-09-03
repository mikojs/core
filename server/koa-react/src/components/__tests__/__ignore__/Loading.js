// @flow

import { type Node as NodeType } from 'react';

export const loadingRender = jest.fn<$ReadOnlyArray<void>, void>();

/** @react use to test Loading rendering */
export default (): NodeType => {
  loadingRender();

  return null;
};
