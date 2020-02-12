// @flow

import React, { useEffect, type Node as NodeType } from 'react';
import ReactDOM from 'react-dom';
import ReactLoading from 'react-loading';

import styles from './styles/loading';

type propsType = {||};

/** @react render the loading page */
const Loading = (): NodeType => {
  const loadingDOM = document.createElement('div');

  useEffect((): (() => void) => {
    const rootDOM =
      document.getElementById('__MIKOJS__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })();

    rootDOM.appendChild(loadingDOM);

    return () => {
      rootDOM.removeChild(loadingDOM);
    };
  }, []);

  return ReactDOM.createPortal(
    <div style={styles}>
      <ReactLoading type="cylon" color="#80D8FF" />
    </div>,
    loadingDOM,
  );
};

export default React.memo<propsType>(Loading);
