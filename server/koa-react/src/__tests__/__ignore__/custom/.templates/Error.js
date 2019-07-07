// @flow

import React from 'react';

import { type errorPropsType } from '../../../../types';

/** @react render the error page */
export default ({ error: { message } }: errorPropsType) => <div>{message}</div>;
