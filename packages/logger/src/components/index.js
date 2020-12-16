// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Text } from 'ink';
import Spinner from 'ink-spinner';

import Message, { type propsType as messagePropsType } from './Message';

export type propsType = {|
  logs: {|
    [string]: {|
      loading: false | string,
      messages: $ReadOnlyArray<messagePropsType>,
    |},
  |},
|};

/** @react logger */
const Logger = ({ logs }: propsType) =>
  Object.keys(logs).map((name: string) => (
    <React.Fragment key={name}>
      {logs[name].messages.map((props: messagePropsType, index: number) => (
        <Message {...props} key={index} />
      ))}

      {!logs[name].loading ? null : (
        <Text>
          <Spinner type="dots" />

          {` ${logs[name].loading}`}
        </Text>
      )}
    </React.Fragment>
  ));

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
