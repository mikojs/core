// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Text } from 'ink';

export type propsType = {|
  event: 'success' | 'fail',
|};

/** @react show message */
const Message = ({ event }: propsType) => <Text>{event}</Text>;

export default (React.memo<propsType>(
  Message,
): AbstractComponentType<propsType>);
