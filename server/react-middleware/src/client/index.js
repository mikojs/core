// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { setConfig } from 'react-hot-loader';

import { handleUnhandledRejection } from '@cat-org/utils';

import Root from './Root';

import ErrorComponent from 'templates/Error';

const routesData = /** replace routesData */ [];

handleUnhandledRejection();
setConfig({
  errorReporter: ErrorComponent,
});

export default (async () => {
  ReactDOM.hydrate(
    <Root routesData={routesData} />,
    document.getElementById('__cat__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })(),
  );
})();
