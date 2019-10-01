#! /usr/bin/env node
// @flow

import createServer from 'utils/createServer';

createServer(parseInt(process.argv[2], 10));
