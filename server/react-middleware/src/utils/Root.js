// @flow

import React, { type ComponentType } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { type routeDataType as serverRouteDataType } from './getData';

type routeDataType = {|
  routePath: $PropertyType<serverRouteDataType, 'routePath'>,
  chunkName: $PropertyType<serverRouteDataType, 'chunkName'>,
  component: ComponentType<*>,
|};

/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored
const Root = ({
  routesData,
}: {
  routesData: $ReadOnlyArray<routeDataType>,
}) => (
  <Router>
    <Switch>
      {routesData.map(({ routePath, chunkName, component }: routeDataType) => (
        <Route key={chunkName} path={routePath} component={component} exact />
      ))}
    </Switch>
  </Router>
);
/* eslint-enable require-jsdoc, flowtype/require-return-type */

export default Root;
