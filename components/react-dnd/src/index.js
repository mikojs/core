// @flow

import React from 'react';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import Frame from 'react-frame-component';

import Provider, { DataContext } from './Provider';
import DragLayer from './DragLayer';
import Renderer from './Renderer';
import * as styles from './styles';
import { type contextType } from './types';

/* eslint-disable */
const Example = React.memo(({ forwardedRef, style }) => (
  <div
    ref={forwardedRef}
    style={{
      ...style,
      padding: '5px 10px',
      background: 'red',
      textAlign: 'center',
    }}
  >
    test
  </div>
));
const TODO_LIST = [
  React.forwardRef((props, ref) => <Example {...props} forwardedRef={ref} />),
];
/* eslint-enable */

/** @react use to control the all components */
const Dnd = () => (
  <Provider components={TODO_LIST}>
    <DndProvider backend={HTML5Backend}>
      <DragLayer>
        <DataContext.Consumer>
          {({ manager, previewer, hover, drop }: contextType) => (
            <div style={styles.root}>
              <Renderer source={manager} hover={hover} drop={drop} />

              <Frame
                style={styles.iframe}
                head={
                  <link
                    rel="stylesheet"
                    href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
                  />
                }
              >
                <Renderer source={previewer} hover={hover} drop={drop} />
              </Frame>
            </div>
          )}
        </DataContext.Consumer>
      </DragLayer>
    </DndProvider>
  </Provider>
);

export default React.memo<{||}>(Dnd);
