#! /usr/bin/env node
// @flow

import Server from 'utils/Server';

process.title = '@mikojs/configs';

(() => new Server(parseInt(process.argv[2], 10)))();
