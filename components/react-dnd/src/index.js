// @flow

import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Provider from './Provider';
import * as styles from './styles';

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
      <div style={styles.root}>
        <div style={styles.manager} />

        <div />
      </div>
    </DndProvider>
  </Provider>
));

export default Dnd;
