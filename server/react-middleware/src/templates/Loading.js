// @flow
/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored

import React from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';

import styles from './styles/loading';

type propsType = {};

export default class Loading extends React.PureComponent<propsType> {
  rootDOM: HTMLElement;
  loadingDOM: HTMLElement;

  constructor(props: propsType) {
    super(props);

    this.rootDOM =
      document.getElementById('__CAT__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })();
    this.loadingDOM = document.createElement('div');
  }

  componentDidMount() {
    this.rootDOM.appendChild(this.loadingDOM);
  }

  componentWillUnmount() {
    this.rootDOM.removeChild(this.loadingDOM);
  }

  render() {
    return ReactDOM.createPortal(
      <div style={styles}>
        <ReactLoading type="cylon" color="#80D8FF" />
      </div>,
      this.loadingDOM,
    );
  }
}
