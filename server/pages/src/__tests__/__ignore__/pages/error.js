// @flow

import React from 'react';

type propsType = {||};

export const error = new Error('error');

/** @react Error Component */
const ErrorPage = () => {
  throw error;
};

export default React.memo<propsType>(ErrorPage);
