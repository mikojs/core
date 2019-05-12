import React, { Component } from 'react';
import styles from './styles/list.js';
import lists from './Lists';

const createListItem = (item='', i=0) => {
  return (
    <li className="navListItem" key={i}>
      <a
        className="navItem"
        href={`/${item.trim()}`}
        style={styles.itemElement}
      >
        {item}
      </a>
    </li>
  );
};

class List extends Component {
  constructor() {
    super();
    this.state = {
      listItem: [],
    };
  }

  componentDidMount() {
    this.setState({ listItem: lists });
  }

  render() {
    const { listItem } = this.state;

    return (
      <div style={styles.headElement}>
        <h3>Introduction</h3>
        <ul style={{ listStyleType: 'none', paddingInlineStart: '20px' }}>
          {listItem.map((item, i) => createListItem(item, i))}
        </ul>
      </div>
    );
  }
}

export default List;
