// @flow

import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ExecutionEnvironment } from 'fbjs';

type ctxType = {|
  ctx: { [string]: string },
  isLoading: boolean,
|};

/**
 * @example
 * useCtx()
 *
 * @return {ctxType} - ctx object
 */
export default (): ctxType => {
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
  const prevCtxRef = useRef(ctx);

  useEffect(() => {
    prevCtxRef.current = ctx;
  }, [ctx.originalUrl]);

  const { current: prevCtx } = prevCtxRef;

  return {
    ctx,
    isLoading: prevCtx.originalUrl !== ctx.originalUrl,
  };
};
