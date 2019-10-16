// @flow

// $FlowFixMe TODO: https://github.com/flow-typed/flow-typed/pull/3570, move after fbjs
import { useLocation } from 'react-router-dom';
import React, {
  useState,
  useEffect,
  useRef,
  type ComponentType,
  type Node as NodeType,
} from 'react';
import { ExecutionEnvironment } from 'fbjs';

import { type errorPropsType } from '../types';

import ErrorCatch from './ErrorCatch';
import getPage from './getPage';

export type propsType<M = {}, P = {}> = {|
  Main: ComponentType<*>,
  Loading: ComponentType<{||}>,
  Error: ComponentType<errorPropsType>,
  routesData: $ReadOnlyArray<{|
    exact: true,
    path: $ReadOnlyArray<string>,
    component: {|
      filePath: string,
      chunkName: string,
      loader: () => Promise<{|
        default: ComponentType<*>,
      |}>,
    |},
  |}>,
  InitialPage: ComponentType<*>,
  mainInitialProps: M,
  pageInitialProps: P,
|};

/** @react use to control page */
const Root = <M, P>({
  Main,
  Loading,
  Error,
  routesData,
  InitialPage,
  mainInitialProps,
  pageInitialProps,
}: propsType<M, P>): NodeType => {
  const isServer = !ExecutionEnvironment.canUseEventListeners;
  const { pathname, search } = useLocation();
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
  const [{ Page, mainProps, pageProps }, updatePage] = useState({
    Page: InitialPage,
    mainProps: mainInitialProps,
    pageProps: pageInitialProps,
  });
  const prevCtxRef = useRef(ctx);
  const isMountedRef = useRef(false);

  useEffect((): (() => void) => {
    let cancel: boolean = false;

    prevCtxRef.current = ctx;

    if (!isServer && isMountedRef.current)
      (async () => {
        const newPageData = await getPage(Main, routesData, ctx, isServer);

        if (cancel) return;

        updatePage(newPageData);
      })();

    if (!isMountedRef.current) isMountedRef.current = true;

    return () => {
      cancel = true;
    };
  }, [ctx.originalUrl]);
  const { current: prevCtx } = prevCtxRef;

  return (
    <ErrorCatch Error={Error}>
      <Main {...mainProps} Component={Page}>
        {<-V: { key: string }>(props?: V) =>
          prevCtx.originalUrl !== ctx.originalUrl ? (
            <Loading />
          ) : (
            <Page {...props} {...pageProps} />
          )
        }
      </Main>
    </ErrorCatch>
  );
};

export default React.memo<propsType<>>(Root);
