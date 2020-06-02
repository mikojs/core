// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';

import ErrorCatch, {
  type propsType as errorCatchPropsType,
  type errorPropsType,
} from './ErrorCatch';

import {
  type mainComponentType as mainType,
  type routeType,
} from './utils/getPage';
import getStatic from './utils/getStatic';

import usePage, { type returnType as usePageReturnType } from './hooks/usePage';

export type {
  pageInitialArguType,
  pageComponentType,
  mainInitialArguType,
  mainComponentType,
} from './utils/getPage';

export type { errorPropsType as errorComponentPropsType } from './ErrorCatch';
export type { documentComponentType } from './server';

export type propsType = {|
  Main: mainType<*, *>,
  Loading: ComponentType<{||}>,
  Error: $PropertyType<errorCatchPropsType, 'Error'>,
  routes: $ReadOnlyArray<routeType>,
  errorProps?: errorPropsType,
  initialState: $Diff<usePageReturnType, {| isLoading: boolean |}>,
|};

/** @react use to control page */
const Root = ({
  Main,
  Loading,
  Error,
  routes,
  errorProps,
  initialState,
}: propsType): NodeType => {
  const { Page, mainProps, pageProps, isLoading } = usePage(
    initialState,
    Main,
    routes,
  );

  return (
    <ErrorCatch Error={Error} errorProps={errorProps}>
      <Main {...mainProps} Page={getStatic(Page)}>
        {(props?: {}) =>
          isLoading ? <Loading /> : <Page {...props} {...pageProps} />
        }
      </Main>
    </ErrorCatch>
  );
};

export default React.memo<propsType>(Root);
