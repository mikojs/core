// @flow

import React from 'react';

import Provider, { DataContext } from './Provider';
import Previewer, { type propsType as previewerPropsType } from './Previewer';

export default React.memo<{||}>(() => (
  <Provider>
    <DataContext.Consumer>
      {({ source, handler }: previewerPropsType) => (
        <Previewer source={source} handler={handler} />
      )}
    </DataContext.Consumer>
  </Provider>
));
