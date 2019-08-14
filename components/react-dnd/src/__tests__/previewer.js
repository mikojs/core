// @flow

import React from 'react';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import { mount } from 'enzyme';

import Previewer from '../Previewer';

test('Previewer', () => {
  expect(
    mount(
      <DndProvider backend={HTML5Backend}>
        <Previewer>
          <div>test</div>
        </Previewer>
      </DndProvider>,
    ).contains(<div>test</div>),
  ).toBeTruthy();
});
