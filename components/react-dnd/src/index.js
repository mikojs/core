// @flow

import React from 'react';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import Frame from 'react-frame-component';

import Previewer from './Previewer';
import Renderer from './Renderer';
import * as styles from './styles';

/** @react use to control the all components */
const Dnd = () => (
  <DndProvider backend={HTML5Backend}>
    <div style={styles.root}>
      <div />

      <Frame
        style={styles.iframe}
        head={
          <link
            rel="stylesheet"
            href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
          />
        }
      >
        <Renderer
          source={{
            id: 'previewer',
            data: { type: Previewer },
          }}
        />
      </Frame>
    </div>
  </DndProvider>
);

export default React.memo<{||}>(Dnd);
