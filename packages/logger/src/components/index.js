// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Text } from 'ink';
import Divider from 'ink-divider';

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
    <React.Fragment key={name}>
      <Divider title={name} width={100} />

      <Text>{JSON.stringify(logs[name])}</Text>
    </React.Fragment>
  ));

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
