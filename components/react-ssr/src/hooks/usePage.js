// @flow

import { useState, useRef, useEffect, type ComponentType } from 'react';
import { useLocation } from 'react-router-dom';

import getPage, {
  type mainComponentType,
  type routeType,
  type returnType as getPageReturnType,
} from 'utils/getPage';

export type returnType = {|
  ...$Diff<getPageReturnType, {| chunkName: mixed |}>,
  isLoading: boolean,
|};

/**
 * @param {returnType} initialState - initail state
 * @param {ComponentType} Main - main component
 * @param {routeType} routes - routes array
 *
 * @return {returnType} - return page object
 */
export default (
  initialState: $Diff<returnType, {| isLoading: boolean |}>,
  Main: mainComponentType<*, *>,
  routes: $ReadOnlyArray<routeType>,
): returnType => {
  const ctx = useLocation();
  const prevCtxRef = useRef(ctx);
  const [{ Page, mainProps, pageProps }, updatePage] = useState(initialState);
  const isMountedRef = useRef(false);

  useEffect((): (() => void) => {
    let cancel: boolean = false;

    if (isMountedRef.current)
      getPage(Main, routes, ctx).then((newPage: getPageReturnType) => {
        if (cancel) return;

        updatePage(newPage);
      });

    isMountedRef.current = true;
    prevCtxRef.current = ctx;

    return () => {
      cancel = true;
    };
  }, [ctx.pathname]);

  const { current: prevCtx } = prevCtxRef;

  return {
    Page,
    mainProps,
    pageProps,
    isLoading: prevCtx.pathname !== ctx.pathname,
  };
};
