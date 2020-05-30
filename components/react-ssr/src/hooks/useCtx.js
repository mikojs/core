// @flow

import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ExecutionEnvironment } from 'fbjs';

export type ctxType = {|
  ctx: { [string]: string },
  isLoading: boolean,
  isServer: boolean,
|};

/**
 * @return {ctxType} - ctx object
 */
export default (): ctxType => {
  const isServer = !ExecutionEnvironment.canUseEventListeners;
  const ctx = useLocation();
  const prevCtxRef = useRef(ctx);

  useEffect(() => {
    prevCtxRef.current = ctx;
  }, [ctx.pathname]);

  const { current: prevCtx } = prevCtxRef;

  return {
    ctx,
    isLoading: prevCtx.pathname !== ctx.pathname,
    isServer,
  };
};
