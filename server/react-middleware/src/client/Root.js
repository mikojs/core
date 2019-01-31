// @flow

import React, { type ElementType } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Main from 'templates/Main';

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
    <Main>
      <Switch>
        {routesData.map((props: routePropsType) => (
          <Route {...props} />
        ))}
      </Switch>
    </Main>
  </Router>
);
/* eslint-enable require-jsdoc, flowtype/require-return-type */

export default Root;
