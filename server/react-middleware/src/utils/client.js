// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { setConfig } from 'react-hot-loader';

import { handleUnhandledRejection } from '@cat-org/utils';

import Root from './Root';

import Main from 'templates/Main';
import ErrorComponent from 'templates/Error';

handleUnhandledRejection();
setConfig({
  errorReporter: ErrorComponent,
});

export default (async () => {
  Root.preload(window.__CAT_DATA__);
  ReactDOM.hydrate(
    <Router>
      <Root Main={Main} Error={ErrorComponent} routesData={[]} />
    </Router>,
    document.getElementById('__cat__') ||
      (() => {
        throw new Error('Can not find main HTMLElement');
      })(),
  );
})();
