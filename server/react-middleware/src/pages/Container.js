// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React from 'react';
import { Helmet } from 'react-helmet';

export default class Container extends React.PureComponent {
  static getInitialProps = async ({ Page, ...ctx }) => {
    const head = (
      <Helmet>
        <title>title</title>
      </Helmet>
    );

    return {
      head,
      ...((await Page.getInitialProps?.({
        ...ctx,
        head,
      })) || {}),
    };
  };

  render() {
    return null;
  }
}
