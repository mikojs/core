// @flow

import React, {
  useState,
  useEffect,
  type ComponentType,
  type Node as NodeType,
} from 'react';
import { emptyFunction, ExecutionEnvironment } from 'fbjs';
import { withRouter, type Location as locationType } from 'react-router-dom';

import { type errorPropsType } from '../types';
import { type lazyComponentType } from '../ReactIsomorphic';

import ErrorCatch from './ErrorCatch';
import getPage from './getPage';

export type propsType = {|
  Main: ComponentType<*>,
  Loading: ComponentType<{||}>,
  Error: ComponentType<errorPropsType>,
  routesData: $ReadOnlyArray<{|
    exact: true,
    path: $ReadOnlyArray<string>,
    component: {|
      filePath: string,
      chunkName: string,
      loader: lazyComponentType,
    |},
  |}>,
  InitialPage: ComponentType<*>,
  mainInitialProps: {},
  pageInitialProps: {},
  location: locationType,
|};

let isMounted: boolean = false;

/** @react use to control page */
const Root = ({
  Main,
  Loading,
  Error,
  routesData,
  InitialPage,
  mainInitialProps,
  pageInitialProps,
  location: { pathname, search },
}: propsType): NodeType => {
  const isServer = !ExecutionEnvironment.canUseEventListeners;
  const ctx = isServer
    ? {}
    : {
        path: pathname,
        querystring: search.replace(/\?/, ''),
        originalUrl: `${pathname}${search}`,
        origin: window.location.origin,
        href: window.location.href,
        host: window.location.host,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
      };
  const [{ Page, mainProps, pageProps, isLoading }, updatePage] = useState({
    Page: InitialPage,
    mainProps: mainInitialProps,
    pageProps: pageInitialProps,
    isLoading: false,
  });

  useEffect((): (() => void) => {
    let cancel: boolean = false;

    if (!isServer && isMounted)
      (async () => {
        updatePage({
          Page: emptyFunction.thatReturnsNull,
          mainProps: {},
          pageProps: {},
          isLoading: true,
        });

        const newPageData = await getPage(Main, routesData, ctx, isServer);

        if (cancel) return;

        updatePage({
          ...newPageData,
          isLoading: false,
        });
      })();

    if (!isMounted) isMounted = true;

    return () => {
      cancel = true;
    };
  }, [ctx.originalUrl]);

  return (
    <ErrorCatch Error={Error}>
      <Main {...mainProps}>
        {<-P: { key: string }>(props?: P) =>
          isLoading ? <Loading /> : <Page {...props} {...pageProps} />
        }
      </Main>
    </ErrorCatch>
  );
};

export default React.memo<$Diff<propsType, {| location: mixed |}>>(
  withRouter(Root),
);
