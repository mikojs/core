// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';
import { Text } from 'ink';
import Spinner from 'ink-spinner';

import Message, { type propsType as messagePropsType } from './Message';

type messageType = {|
  ...messagePropsType,
  id: string,
|};

export type propsType = {|
  loading: {|
    [string]: string,
  |},
  messages: $ReadOnlyArray<messageType>,
|};

/** @react logger */
const Logger = ({ loading, messages }: propsType) => (
  <>
    {messages.map(({ id, ...props }: messageType) => (
      <Message {...props} key={id} />
    ))}

    {Object.keys(loading).map((name: string) => (
      <Text key={name}>
        <Spinner type="dots" />

        {` ${name} ${loading[name]}`}
      </Text>
    ))}
  </>
);

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
