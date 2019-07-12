// @flow

import { type ComponentType } from 'react';
import { type Match as MatchType } from 'react-router-dom';

type ctxType<T = {}> = {|
  ctx: {|
    path: string,
    querystring: string,
    originalUrl: string,
    origin: string,
    href: string,
    host: string,
    hostname: string,
    protocol: string,
  |} & T,
  isServer: boolean,
|};

export type mainCtxType<P = {}, T = {}, C = ComponentType<P>> = ctxType<T> & {|
  Component: C,
  pageProps: P,
|};

export type errorPropsType = {|
  error: Error,
  errorInfo: {|
    componentStack: string,
  |},
|};

export type pageCtxType<T = {}> = ctxType<T> & {|
  match: MatchType,
|};
