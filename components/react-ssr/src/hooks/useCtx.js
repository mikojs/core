// @flow

import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export type ctxType = {|
  ctx: { [string]: string },
  isLoading: boolean,
|};

/**
 * @return {ctxType} - ctx object
 */
export default (): ctxType => {
  const ctx = useLocation();
  const prevCtxRef = useRef(ctx);

  useEffect(() => {
    prevCtxRef.current = ctx;
  }, [ctx.pathname]);

  const { current: prevCtx } = prevCtxRef;

  return {
    ctx,
    isLoading: prevCtx.pathname !== ctx.pathname,
  };
};
