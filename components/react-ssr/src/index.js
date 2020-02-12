// @flow

import React, { type ComponentType, type Node as NodeType } from 'react';

import ErrorCatch, {
  type errorPropsType,
  type propsType as errorCatchPropsType,
} from './ErrorCatch';

import {
  type pageInitialArguType as pageArguType,
  type pageComponentType as pageType,
  type mainInitialArguType as mainArguType,
  type mainComponentType as mainType,
  type routesDataType,
} from 'utils/getPage';
import getStatic from 'utils/getStatic';

import useCtx from 'hooks/useCtx';
import usePage, { type returnType as usePageReturnType } from 'hooks/usePage';

export type pageInitialArguType<C> = pageArguType<C>;
export type pageComponentType<C, P, EP = {}> = pageType<C, P, EP>;
export type mainInitialArguType<C, P = pageComponentType<C, *>> = mainArguType<
  C,
  P,
>;
export type mainComponentType<C, P> = mainType<C, P>;
export type errorComponentPropsType = errorPropsType;
export type propsType = {|
  Main: mainType<*, *>,
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
      <Main {...mainProps} Page={getStatic(Page)}>
        {(props?: {}) =>
          isLoading ? <Loading /> : <Page {...props} {...pageProps} />
        }
      </Main>
    </ErrorCatch>
  );
};

export default React.memo<propsType>(Root);
