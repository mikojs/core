#! /usr/bin/env node
// @flow

import server from './server';

server(
  !process.env.STATIC && process.env.NODE_ENV !== 'production',
  Boolean(process.env.STATIC),
);
