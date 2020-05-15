// @flow

import { useState, useRef, useEffect, type ComponentType } from 'react';

import getPage, {
  type mainComponentType,
  type routesDataType,
  type returnType as getPageReturnType,
} from 'utils/getPage';

import { type ctxType } from 'hooks/useCtx';

export type returnType = $Diff<getPageReturnType, {| chunkName: mixed |}>;

/**
 * @param {returnType} initialState - initail state
 * @param {ComponentType} Main - main component
 * @param {routesDataType} routesData - routes data
 * @param {ctxType.ctx} ctx - ctx object
 * @param {ctxType.isServer} isServer - isServer or not
 *
 * @return {returnType} - return page object
 */
export default (
  initialState: returnType,
  Main: mainComponentType<*, *>,
  routesData: routesDataType,
  ctx: $PropertyType<ctxType, 'ctx'>,
  isServer: $PropertyType<ctxType, 'isServer'>,
): returnType => {
  const [{ Page, mainProps, pageProps }, updatePage] = useState(initialState);
  const isMountedRef = useRef(false);

  useEffect((): (() => void) => {
    let cancel: boolean = false;

    if (!isServer && isMountedRef.current)
      getPage(Main, routesData, ctx, isServer).then(
        (newPageData: getPageReturnType) => {
          if (cancel) return;

          updatePage(newPageData);
        },
      );

    isMountedRef.current = true;

    return () => {
      cancel = true;
    };
  }, [ctx.originalUrl]);

  return {
    Page,
    mainProps,
    pageProps,
  };
};
