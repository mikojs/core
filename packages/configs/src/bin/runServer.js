#! /usr/bin/env node
// @flow

import Server from 'utils/Server';

(() => new Server(parseInt(process.argv[2], 10)))();
