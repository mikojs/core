// @flow

import React, { type Node as NodeType } from 'react';

import Previewer, { type propsType as previewerPropsType } from './Previewer';
import * as styles from './styles/main';

type propsType = {|
  add: $PropertyType<previewerPropsType, 'handler'>,
  children: NodeType,
|};

// TODO
const source = {
  id: 'root',
  data: {
    type: 'div',
    props: {
      children: 'test',
    },
  },
  children: [],
};

const Main = React.memo<propsType>(({ add, children }: propsType) => (
  <div style={styles.root}>
    <div style={styles.list}>
      <Previewer source={source} handler={add} />
    </div>

    <div style={styles.previewer}>{children}</div>
  </div>
));

export default Main;
