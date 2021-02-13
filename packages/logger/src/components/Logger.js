// @flow

import React, { type AbstractComponent as AbstractComponentType } from 'react';

import Message from './Message';
import useMessages, {
  type messagesType,
  type messagesStateType,
} from './hooks/useMessages';

type propsType = messagesType;

/** @react logger */
const Logger = (props: propsType) =>
  useMessages(props).map((message: $ElementType<messagesStateType, number>) => (
    <Message {...message} />
  ));

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
