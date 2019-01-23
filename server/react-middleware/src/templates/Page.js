// @flow

import React from 'react';
import loadable from 'react-loadable';

// TODO: add default not found and loading
export default loadable({
  loader: () => /** replace page */ <div>page not found</div>,
  loading: () => <div>loading</div>,
});
