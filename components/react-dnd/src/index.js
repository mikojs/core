// @flow

import React from 'react';

import Provider, { DataContext, type contextType } from './Provider';
import Previewer from './Previewer';
import Main from './Main';

export default React.memo<{||}>(() => (
  <Provider>
    <DataContext.Consumer>
      {({ source, move, add }: contextType) => (
        <Main add={add}>
          <Previewer source={source} handler={move} />
        </Main>
      )}
    </DataContext.Consumer>
  </Provider>
));
