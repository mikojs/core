// @flow

import { type Node as NodeType } from 'react';

type tagType = {|
  toString(): string,
  toComponent(): NodeType,
|};

type attributetagType = {|
  toString(): string,
  toComponent(): { [string]: * },
|};

export type ctxType<T = {}> = {
  isServer: boolean,
  ctx: {
    path: string,
    querystring: string,
    url: string,
    originalUrl: string,
    origin: string,
    href: string,
    host: string,
    hostname: string,
    protocol: string,
  } & T,
};

export type helmetType = {|
  base: tagType,
  bodyAttributes: attributetagType,
  htmlAttributes: attributetagType,
  link: tagType,
  meta: tagType,
  noscript: tagType,
  script: tagType,
  style: tagType,
  title: tagType,
|};

export type errorPropsType = {|
  error: Error,
  errorInfo: {
    componentStack: string,
  },
|};
