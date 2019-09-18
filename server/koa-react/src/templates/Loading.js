// @flow

import React, { type Node as NodeType } from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';

import styles from './styles/loading';

type propsType = {};

/** render the loading page */
export default class Loading extends React.PureComponent<propsType> {
  rootDOM: HTMLElement;
  loadingDOM: HTMLElement;

  /** @react */
  constructor(props: propsType) {
    super(props);

    this.rootDOM =
      document.getElementById('__MIKOJS__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })();
    this.loadingDOM = document.createElement('div');
  }

  /** @react */
  componentDidMount() {
    this.rootDOM.appendChild(this.loadingDOM);
  }

  /** @react */
  componentWillUnmount() {
    this.rootDOM.removeChild(this.loadingDOM);
  }

  /** @react */
  render(): NodeType {
    return ReactDOM.createPortal(
      <div style={styles}>
        <ReactLoading type="cylon" color="#80D8FF" />
      </div>,
      this.loadingDOM,
    );
  }
}
