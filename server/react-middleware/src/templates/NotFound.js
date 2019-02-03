// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React from 'react';
import { Helmet } from 'react-helmet';

import { type ctxType } from '../types';

export default class NotFound extends React.PureComponent<*> {
  static getInitialProps = ({ ctx }: ctxType<{ status: number }>) => {
    ctx.status = 404;

    return {
      head: (
        <Helmet>
          <title>404 | Page not found</title>
        </Helmet>
      ),
    };
  };

  render() {
    return <div>Page not found</div>;
  }
}
