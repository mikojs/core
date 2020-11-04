// @flow

import path from 'path';

import graphql, { type graphqlType } from '../../index';

export default (graphql(path.resolve(__dirname, './schemas')): graphqlType);
