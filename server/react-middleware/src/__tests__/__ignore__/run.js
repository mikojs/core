#! /usr/bin/env node
// @flow

import server from './server';

server(process.env.NODE_ENV !== 'production');
