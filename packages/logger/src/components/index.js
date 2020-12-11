// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Text } from 'ink';

export type eventType = 'success' | 'fail';
export type propsType = {|
  logs: {|
    [string]: {|
      [eventType]: $ReadOnlyArray<string>,
    |},
  |},
|};

/** @react logger */
const Logger = ({ logs }: propsType) => <Text>{JSON.stringify(logs)}</Text>;

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
