// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React, { type Node as NodeType } from 'react';
import { type Helmet as HelmetType } from 'react-helmet';

// TODO: add default head
const Document = ({
  helmet,
  children,
}: {
  helmet: $Call<$PropertyType<Class<HelmetType>, 'renderStatic'>>,
  children: NodeType,
}) => (
  <html>
    <head>
      {helmet.title.toComponent()}
      {helmet.meta.toComponent()}
      {helmet.link.toComponent()}
    </head>

    <body>
      {children}
      {helmet.script.toComponent()}
    </body>
  </html>
);

export default Document;
