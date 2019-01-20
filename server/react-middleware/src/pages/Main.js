// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React from 'react';
import { Helmet } from 'react-helmet';
import { hot } from 'react-hot-loader/root';

class Main extends React.PureComponent {
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
    return <div>TODO</div>;
  }
}

export default hot(Main);
