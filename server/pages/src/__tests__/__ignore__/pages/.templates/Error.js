// @flow

import React from 'react';

import { type errorComponentPropsType } from '@mikojs/react-ssr';

/** @react render the error page */
const Error = ({ error: { message } }: errorComponentPropsType) => (
  <div>
    <h1>😞😱🔨 Error</h1>

    <p>{message}</p>
  </div>
);

export default React.memo<errorComponentPropsType>(Error);
