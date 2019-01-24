// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';

export default class Document extends React.PureComponent<{
  head: NodeType,
  scripts: NodeType,
  children: NodeType,
}> {
  render() {
    const { head, scripts, children } = this.props;

    return (
      <html>
        <head>{head}</head>

        <body>
          {children}
          {scripts}
        </body>
      </html>
    );
  }
}
