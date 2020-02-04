// @flow

import { setConfig } from 'react-hot-loader';

import { handleUnhandledRejection } from '@mikojs/utils';
import client from '@mikojs/react-ssr/lib/client';

import Main from 'templates/Main';
import Loading from 'templates/Loading';
import Error from 'templates/Error';
import routesData from 'templates/routesData';

handleUnhandledRejection();
setConfig({
  errorReporter: Error,
});
client({
  Main,
  Loading,
  Error,
  routesData,
});
