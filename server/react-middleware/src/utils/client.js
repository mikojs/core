// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import Main from 'pages/Main';

(() => {
  ReactDOM.hydrate(<Main />, document.getElementById('__cat__'));
})();
