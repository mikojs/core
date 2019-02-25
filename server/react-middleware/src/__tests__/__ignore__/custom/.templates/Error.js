// @flow

import { type errorPropsType } from '../../../../types';

export default ({ error: { message } }: errorPropsType) => message;
