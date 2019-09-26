// @flow

import React from 'react';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';

import EventsProvider from './EventsProvider';

/* eslint-disable */
const Example = () => <div>test</div>;
/* eslint-enable */

/** @react use to control the all main components */
const Cms = () => (
  <DndProvider backend={HTML5Backend}>
    <EventsProvider>
      <Example />
      <Example />
    </EventsProvider>
  </DndProvider>
);

export default React.memo<{||}>(Cms);
