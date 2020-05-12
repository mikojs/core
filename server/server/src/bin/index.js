#! /usr/bin/env node
// @flow

import buildApi from '../index';
import buildCli from '../buildCli';

buildCli(process.argv, buildApi);
