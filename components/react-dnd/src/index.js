// @flow

import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Frame, { FrameContextConsumer } from 'react-frame-component';

import Provider, { DataContext } from './Provider';
import Renderer from './Renderer';
import * as styles from './styles';
import { type contextType } from './types';

/* eslint-disable */
const Example = React.memo(({ forwardedRef }) => (
  <div ref={forwardedRef}>test</div>
));
const TODO_LIST = [
  React.forwardRef((props, ref) => <Example forwardedRef={ref} />),
];
/* eslint-enable */

/** @react use to control the all components */
const Dnd = () => (
  <Provider components={TODO_LIST}>
    <DndProvider backend={HTML5Backend}>
      <DataContext.Consumer>
        {({ manager, previewer, handler }: contextType) => (
          <div style={styles.root}>
            <Renderer source={manager} handler={handler} />

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
                    <Renderer source={previewer} handler={handler} />
                  </DndProvider>
                )}
              </FrameContextConsumer>
            </Frame>
          </div>
        )}
      </DataContext.Consumer>
    </DndProvider>
  </Provider>
);

export default React.memo<{||}>(Dnd);
