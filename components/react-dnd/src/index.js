// @flow

import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Provider, { DataContext } from './Provider';
import Previewer, { type propsType as previewerPropsType } from './Previewer';

export default React.memo<{||}>(() => (
  <Provider>
    <DndProvider backend={HTML5Backend}>
      <DataContext.Consumer>
        {({ source, handler }: previewerPropsType) => (
          <Previewer source={source} handler={handler} />
        )}
      </DataContext.Consumer>
    </DndProvider>
  </Provider>
));
