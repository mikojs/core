// @flow

import React from 'react';

import { type errorComponentPropsType } from '@mikojs/react-ssr';

/** @react render the error page */
export default ({ error: { message } }: errorComponentPropsType) => (
  <div>{message}</div>
);
