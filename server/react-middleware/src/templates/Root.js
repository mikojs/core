// @flow

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';

import { type routeDataType } from 'utils/getRoutesData';

const clientRoutesData = /** replace routesData */ [];

/**
 * @example
 * getRoutes([])
 *
 * @param {Array} routesData - routes data
 *
 * @return {Component} - routes Component
 */
export const getRoutes = (routesData: $ReadOnlyArray<routeDataType>) => (
  <Switch>
    {routesData.map(({ routePath, chunkName, component }: routeDataType) => (
      <Route key={chunkName} path={routePath} component={component} exact />
    ))}
  </Switch>
);

/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored
class Root extends React.PureComponent {
  render() {
    return <Router>{getRoutes(clientRoutesData)}</Router>;
  }
}
/* eslint-enable require-jsdoc, flowtype/require-return-type */

export default hot(Root);
