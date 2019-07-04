// @flow

import React, { type Node as NodeType } from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';

import styles from './styles/loading';

type propsType = {};

/** Loading Component to rneder the loading page */
export default class Loading extends React.PureComponent<propsType> {
  rootDOM: HTMLElement;
  loadingDOM: HTMLElement;

  // TODO component should be ignored
  // eslint-disable-next-line jsdoc/require-jsdoc
  constructor(props: propsType) {
    super(props);

    this.rootDOM =
      document.getElementById('__CAT__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })();
    this.loadingDOM = document.createElement('div');
  }

  // TODO component should be ignored
  // eslint-disable-next-line jsdoc/require-jsdoc
  componentDidMount() {
    this.rootDOM.appendChild(this.loadingDOM);
  }

  // TODO component should be ignored
  // eslint-disable-next-line jsdoc/require-jsdoc
  componentWillUnmount() {
    this.rootDOM.removeChild(this.loadingDOM);
  }

  // TODO component should be ignored
  // eslint-disable-next-line jsdoc/require-jsdoc
  render(): NodeType {
    return ReactDOM.createPortal(
      <div style={styles}>
        <ReactLoading type="cylon" color="#80D8FF" />
      </div>,
      this.loadingDOM,
    );
  }
}
