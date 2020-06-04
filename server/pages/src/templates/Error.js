// @flow

import React from 'react';
import { Helmet } from 'react-helmet';

import { type errorComponentPropsType } from '@mikojs/react-ssr';

import * as styles from './styles/error';

/** @react render the error page */
const Error = ({
  error: { message },
  errorInfo: { componentStack },
}: errorComponentPropsType) => (
  <div style={styles.root}>
    <Helmet>
      <title>500 | Error</title>
    </Helmet>

    <div>
      <h1 style={styles.h1}>😞😱🔨 Error</h1>

      <p style={styles.p}>{message}</p>

      {componentStack.split(/\n/).map((text: string) => (
        <p key={text} style={styles.p}>
          {text}
        </p>
      ))}
    </div>
  </div>
);

export default React.memo<errorComponentPropsType>(Error);
