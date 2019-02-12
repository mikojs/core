// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { setConfig } from 'react-hot-loader';
import { BrowserRouter as Router } from 'react-router-dom';

import { handleUnhandledRejection } from '@cat-org/utils';

import Core from '../Core';

import Main from 'templates/Main';
import ErrorComponent from 'templates/Error';

const routesData = /** replace routesData */ [];

handleUnhandledRejection();
setConfig({
  errorReporter: ErrorComponent,
});

export default (async () => {
  ReactDOM.hydrate(
    <Router>
      <Core
        Main={Main}
        Error={ErrorComponent}
        routesData={routesData}
      />
    </Router>,
    document.getElementById('__cat__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })(),
  );
})();
