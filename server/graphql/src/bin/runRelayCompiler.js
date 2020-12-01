#! /usr/bin/env node
// @flow

import { relayCompiler } from 'relay-compiler';
import { type Config as ConfigType } from 'relay-compiler/bin/RelayCompilerMain.js.flow';

import { defaultRelayCompilerOptions } from './relayCompiler';

relayCompiler(
  Object.keys(defaultRelayCompilerOptions).reduce(
    (result: ConfigType, key: string) => ({
      ...result,
      [key]: result[key] || defaultRelayCompilerOptions[key],
    }),
    JSON.parse(process.argv[2]),
  ),
);
