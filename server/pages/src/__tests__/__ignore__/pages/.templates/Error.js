// @flow

import React from 'react';

import { type errorComponentPropsType } from '@mikojs/react-ssr';

/** @react render the error page */
const Error = ({ error: { message } }: errorComponentPropsType) => (
  <div>{message}</div>
);

export default React.memo<errorComponentPropsType>(Error);
