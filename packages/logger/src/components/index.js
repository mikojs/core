// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';

import Message, { type propsType as messagePropsType } from './Message';

type messageType = {|
  ...messagePropsType,
  id: string,
|};

export type propsType = {|
  loading: {|
    [string]: {|
      color: string,
      message: string,
    |},
  |},
  messages: $ReadOnlyArray<messageType>,
|};

/** @react logger */
const Logger = ({ loading, messages }: propsType) =>
  [
    ...messages,
    ...Object.keys(loading).map((name: string) => ({
      ...loading[name],
      id: name,
      name,
      event: 'loading',
    })),
  ].map(({ id, ...props }: messageType) => <Message {...props} key={id} />);

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
