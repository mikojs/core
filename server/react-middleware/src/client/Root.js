// @flow

import React, { type ElementType } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

type routePropsType = {|
  exact: true,
  key: string,
  path: $ReadOnlyArray<string>,
  component: ElementType,
|};

/* eslint-disable require-jsdoc, flowtype/require-return-type */
// TODO component should be ignored
const Root = ({
  routesData,
}: {
  routesData: $ReadOnlyArray<routePropsType>,
}) => (
  <Router>
    <Switch>
      {routesData.map((props: routePropsType) => (
        <Route {...props} />
      ))}
    </Switch>
  </Router>
);
/* eslint-enable require-jsdoc, flowtype/require-return-type */

export default Root;
