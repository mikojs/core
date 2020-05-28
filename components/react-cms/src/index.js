// @flow

import React, { type Node as NodeType } from 'react';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import Frame from 'react-frame-component';

import SourceContext from './SourceContext';
import Previewer from './Previewer';

import useSource from './hooks/useSource';
import useDnd from './hooks/useDnd';
import useMainProps from './hooks/useMainProps';

import * as styles from './styles';

type propsType = {||};

/* eslint-disable */
const Example = React.forwardRef(
  ({ children, ...props }: { children?: NodeType }, forwardedRef) => (
    <div {...props} ref={forwardedRef}>
      {
        /* istanbul ignore next */ React.Children.count(children) === 0
          ? 'test'
          : children
      }
    </div>
  ),
);

const Manager = React.memo(() => (
  <div>
    <Example {...useDnd({ id: '1', type: 'only-drag', component: Example })} />
    <Example {...useDnd({ id: '2', type: 'only-drag', component: Example })} />
  </div>
));
/* eslint-enable */

const main = {
  id: 'main',
  parentId: null,
  type: 'only-drop-to-add',
  component: 'main',
  getProps: useMainProps,
};

/** @react use to control the all main components */
const Cms = () => (
  <DndProvider backend={HTML5Backend}>
    <SourceContext.Provider value={useSource([main])}>
      <div style={styles.root}>
        <Manager />

        <Frame
          style={styles.iframe}
          head={
            <link
              rel="stylesheet"
              href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
            />
          }
        >
          <Previewer />
        </Frame>
      </div>
    </SourceContext.Provider>
  </DndProvider>
);

export default React.memo<propsType>(Cms);
