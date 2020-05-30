// @flow

import { useState, useRef, useEffect, type ComponentType } from 'react';

import getPage, {
  type mainComponentType,
  type routeType,
  type returnType as getPageReturnType,
} from 'utils/getPage';

import { type ctxType } from 'hooks/useCtx';

export type returnType = $Diff<getPageReturnType, {| chunkName: mixed |}>;

/**
 * @param {returnType} initialState - initail state
 * @param {ComponentType} Main - main component
 * @param {routeType} routes - routes array
 * @param {ctxType.ctx} ctx - ctx object
 *
 * @return {returnType} - return page object
 */
export default (
  initialState: returnType,
  Main: mainComponentType<*, *>,
  routes: $ReadOnlyArray<routeType>,
  ctx: $PropertyType<ctxType, 'ctx'>,
): returnType => {
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

    return () => {
      cancel = true;
    };
  }, [ctx.pathname]);

  return {
    Page,
    mainProps,
    pageProps,
  };
};
