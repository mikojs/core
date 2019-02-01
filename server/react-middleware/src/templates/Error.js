// @flow

import { type errorPropsType } from '../types';

// TODO: write default component
export default ({ error: { message } }: errorPropsType) => message;
