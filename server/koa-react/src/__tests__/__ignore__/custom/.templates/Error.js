// @flow

import React from 'react';

import { type errorPropsType } from '../../../../types';

// TODO: component should be ignore
// eslint-disable-next-line jsdoc/require-jsdoc
export default ({ error: { message } }: errorPropsType) => <div>{message}</div>;
