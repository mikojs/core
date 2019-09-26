// @flow

import React from 'react';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';

import useDnd from './hooks/useDnd';

/* eslint-disable */
const Example = ({ id }) => <div {...useDnd(id)}>test</div>;
/* eslint-enable */

/** @react use to control the all main components */
const Cms = () => (
  <DndProvider backend={HTML5Backend}>
    <Example id="1" />
    <Example id="2" />
  </DndProvider>
);

export default React.memo<{||}>(Cms);
