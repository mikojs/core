// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Text } from 'ink';

export type eventType = 'success' | 'fail';
export type propsType = {|
  logs: {|
    [string]: $ReadOnlyArray<{|
      event: eventType,
      message: string,
    |}>,
  |},
|};

/** @react logger */
const Logger = ({ logs }: propsType) =>
  Object.keys(logs).map((name: string) => (
    <Text key={name}>{JSON.stringify(logs[name])}</Text>
  ));

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
