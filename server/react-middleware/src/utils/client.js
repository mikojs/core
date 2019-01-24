// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';

import Root from './Root';

(async () => {
  await Loadable.preloadReady();
  ReactDOM.hydrate(
    <Root />,
    document.getElementById('__cat__') ||
      (() => {
        throw new Error('Can not found main HTMLElement');
      })(),
  );
})();
