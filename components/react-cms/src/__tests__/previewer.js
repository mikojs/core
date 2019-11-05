// @flow

import React from 'react';
import { mount } from 'enzyme';

import Previewer from '../Previewer';
import SourceContext from '../SourceContext';

test('Previewer', () => {
  expect(
    mount(
      <SourceContext.Provider
        value={{
          source: [
            {
              id: 'main',
              parentId: null,
              type: 'drag-and-drop',
              component: 'div',
            },
            {
              id: 'child id',
              parentId: 'main',
              type: 'drag-and-drop',
              component: 'div',
              getProps: () => ({
                children: 'test',
              }),
            },
          ],
          updateSource: jest.fn(),
        }}
      >
        <Previewer />
      </SourceContext.Provider>,
    ).html(),
  ).toBe('<div><div>test</div></div>');
});
