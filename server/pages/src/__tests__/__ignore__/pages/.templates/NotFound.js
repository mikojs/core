// @flow

import React from 'react';

type propsType = {||};

/** @react render the not found page */
const NotFound = () => (
  <div>
    <h1>404</h1>

    <h2>Page not found</h2>
  </div>
);

export default React.memo<propsType>(NotFound);
