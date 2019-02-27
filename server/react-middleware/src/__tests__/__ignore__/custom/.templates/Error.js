// @flow

import React from 'react';

import { type errorPropsType } from '../../../../types';

export default ({ error: { message } }: errorPropsType) => <div>{message}</div>;
