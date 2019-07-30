// @flow

import React from 'react';

import Provider, { DataContext, type contextType } from './Provider';
import Previewer from './Previewer';

export default React.memo<{||}>(() => (
  <Provider>
    <DataContext.Consumer>
      {({ source }: contextType) => <Previewer source={source} />}
    </DataContext.Consumer>
  </Provider>
));
