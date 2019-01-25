// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';

const Document = ({
  head,
  scripts,
  children,
}: {
  head: NodeType,
  scripts: NodeType,
  children: NodeType,
}) => (
  <html>
    <head>{head}</head>

    <body>
      {children}
      {scripts}
    </body>
  </html>
);

export default Document;
