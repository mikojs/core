// @flow

import React from 'react';

import constants from './constants';
import styles from './styles';

const { LISTS } = constants;

const List = React.memo<*>(() => (
  <div style={styles.headElement}>
    <h3>Introduction</h3>

    {LISTS.map((item: string) => (
      <li key={item}>
        <a href={`/${item}`} style={styles.itemElement}>
          {item}
        </a>
      </li>
    ))}
  </div>
));

export default List;
