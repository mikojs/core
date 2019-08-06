// @flow

import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Frame, { FrameContextConsumer } from 'react-frame-component';

import Provider, { DataContext } from './Provider';
import Renderer from './Renderer';
import * as styles from './styles';
import { type contextType } from './types';

/*
const Example = React.memo(() => 'test');
const TODO_LIST = [
  {
    id: 'example',
    Component: Example,
  },
];
*/

const Dnd = React.memo<{||}>(() => (
  <Provider>
    <DndProvider backend={HTML5Backend}>
      <DataContext.Consumer>
        {({ manager, previewer }: contextType) => (
          <div style={styles.root}>
            <Renderer source={manager} />

            <Frame
              style={styles.iframe}
              head={
                <link
                  rel="stylesheet"
                  href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
                />
              }
            >
              <FrameContextConsumer>
                {({ window }: { window: mixed }) => (
                  <DndProvider backend={HTML5Backend} context={window}>
                    <Renderer source={previewer} />
                  </DndProvider>
                )}
              </FrameContextConsumer>
            </Frame>
          </div>
        )}
      </DataContext.Consumer>
    </DndProvider>
  </Provider>
));

export default Dnd;
