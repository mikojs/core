// @flow

import React from 'react';
import { Helmet } from 'react-helmet';

import { type errorPropsType } from '../types';

import * as styles from './styles/error';

// TODO component should be ignored
// eslint-disable-next-line jsdoc/require-jsdoc
const Error = ({
  error: { message },
  errorInfo: { componentStack },
}: errorPropsType) => (
  <div style={styles.root}>
    <Helmet>
      <title>500 | Error</title>
    </Helmet>

    <div>
      <h1 style={styles.h1}>😞😱🔨 Error</h1>

      <p style={styles.p}>{message}</p>

      <p
        style={styles.p}
        dangerouslySetInnerHTML={{
          __html: componentStack.replace(/\n/, '').replace(/\n/g, '<br />'),
        }}
      />
    </div>
  </div>
);

export default Error;
