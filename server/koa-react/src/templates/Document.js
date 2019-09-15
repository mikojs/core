// @flow

import React, { type Node as NodeType } from 'react';
import { Helmet } from 'react-helmet';

type propsType = {|
  helmet: $Call<$PropertyType<Class<Helmet>, 'renderStatic'>>,
  children: NodeType,
|};

/** @react render the html */
const Document = ({ helmet, children }: propsType) => (
  <html lang="en">
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

/**
 * @example
 * Document.getInitialProps({ ctx })
 *
 * @return {propsType} - initial props
 */
Document.getInitialProps = () => ({
  // Reference: https://github.com/joshbuchea/HEAD
  head: (
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      <title>mikojs</title>

      <link
        rel="stylesheet"
        href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
      />
    </Helmet>
  ),
});

export default React.memo<propsType>(Document);
