// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';

import ErrorCatch, {
  type propsType as errorCatchPropsType,
} from './ErrorCatch';

import { type routesDataType } from 'utils/getPage';
import getStatic from 'utils/getStatic';

import useCtx from 'hooks/useCtx';
import usePage, { type returnType as usePageReturnType } from 'hooks/usePage';

export type propsType = {|
  Main: ComponentType<*>,
  Loading: ComponentType<{||}>,
  Error: $PropertyType<errorCatchPropsType, 'Error'>,
  routesData: routesDataType,
  initialState: usePageReturnType,
|};

/** @react use to control page */
const Root = ({
  Main,
  Loading,
  Error,
  routesData,
  initialState,
}: propsType): NodeType => {
  const { ctx, isLoading, isServer } = useCtx();
  const { Page, mainProps, pageProps } = usePage(
    initialState,
    Main,
    routesData,
    ctx,
    isServer,
  );

  return (
    <ErrorCatch Error={Error}>
      <Main {...mainProps} Component={getStatic(Page)}>
        {(props?: {}) =>
          isLoading ? <Loading /> : <Page {...props} {...pageProps} />
        }
      </Main>
    </ErrorCatch>
  );
};

export default React.memo<propsType>(Root);
