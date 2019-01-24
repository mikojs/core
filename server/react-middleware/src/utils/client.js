// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import Loadable from 'react-loadable';

import { handleUnhandledRejection } from '@cat-org/utils';

import Root from './Root';

handleUnhandledRejection();

export default (async () => {
  await Loadable.preloadReady();
  ReactDOM.hydrate(
    <Root />,
    document.getElementById('__cat__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })(),
  );
})();
