#! /usr/bin/env node
/**
 * fixme-flow-file-annotation
 *
 * Flow not support @babel/plugin-proposal-pipeline-operator
 * https://github.com/facebook/flow/issues/5443
 */
/* eslint-disable flowtype/no-types-missing-file-annotation, flowtype/require-valid-file-annotation */

import defaultMiddleware from '@cat-org/default-middleware';
import react from '@cat-org/react-middleware';

import server from '../index';

// TODO: add checking should use middleware
// eslint-disable-next-line flowtype/no-unused-expressions
server.init()
  |> server.use(defaultMiddleware)
  |> server.use(react())
  |> server.run(process.env.PORT);
