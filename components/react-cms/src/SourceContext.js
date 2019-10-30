// @flow

import React from 'react';
import { emptyFunction } from 'fbjs';

// eslint-disable-next-line import/no-duplicates
import typeof useSourceType from './hooks/useSource';
// eslint-disable-next-line import/no-duplicates
import { type sourceType } from './hooks/useSource';

export default React.createContext<$Call<useSourceType, sourceType>>({
  source: [],
  updateSource: emptyFunction,
});
