// @flow

import React, { type Node as NodeType } from 'react';
import { type Helmet as HelmetType } from 'react-helmet';

type propsType = {|
  helmet: $Call<$PropertyType<Class<HelmetType>, 'renderStatic'>>,
  children: NodeType,
|};

/** @react render the html */
const Document = ({ helmet, children }: propsType) => (
  <html lang="en">
    <body>
      {children}
      {helmet.script.toComponent()}
    </body>
  </html>
);

export default React.memo<propsType>(Document);
