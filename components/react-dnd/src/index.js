// @flow

import React from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Provider, { DataContext } from './Provider';
import Renderer from './Renderer';
import styles from './styles';
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
          <div style={styles}>
            <Renderer source={manager} />

            <Renderer source={previewer} />
          </div>
        )}
      </DataContext.Consumer>
    </DndProvider>
  </Provider>
));

export default Dnd;
