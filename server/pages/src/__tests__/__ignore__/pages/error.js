// @flow

import React from 'react';

/** @react Error Component */
const ErrorPage = () => {
  throw new Error('error');
};

export default React.memo<propsType>(ErrorPage);
