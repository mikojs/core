// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';
import { Helmet } from 'react-helmet';

type propsType = {|
  helmet: $Call<$PropertyType<Class<Helmet>, 'renderStatic'>>,
  children: NodeType,
|};

export default class Document extends React.PureComponent<propsType> {
  static getInitialProps = () => ({
    // Reference: https://github.com/joshbuchea/HEAD
    head: (
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <title>cat-org</title>
      </Helmet>
    ),
  });

  render() {
    const { helmet, children } = this.props;

    return (
      <html>
        <head>
          {helmet.meta.toComponent()}
          {helmet.title.toComponent()}
          {helmet.link.toComponent()}
        </head>

        <body>
          {children}
          {helmet.script.toComponent()}
        </body>
      </html>
    );
  }
}
