// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import Divider from 'ink-divider';

import Message, { type propsType as messagePropsType } from './Message';

export type propsType = {|
  logs: {|
    [string]: $ReadOnlyArray<messagePropsType>,
  |},
|};

/** @react logger */
const Logger = ({ logs }: propsType) =>
  Object.keys(logs).map((name: string) => (
    <React.Fragment key={name}>
      <Divider title={name} width={100} />

      {logs[name].map((messageProps: messagePropsType, index: number) => (
        <Message {...messageProps} key={index} />
      ))}
    </React.Fragment>
  ));

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
