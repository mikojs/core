// @flow

import React, {
  type AbstractComponent as AbstractComponentType,
  type Node as NodeType,
} from 'react';

import Message from './Message';
import useMessages, {
  type messagesArguType,
  type messagesReturnType,
} from './hooks/useMessages';

type propsType = messagesArguType;

/** @react logger */
const Logger = (props: propsType): NodeType => {
  const messages = useMessages(props);

  return messages.map(
    ({ key, ...message }: $ElementType<messagesReturnType, number>) => (
      <Message {...message} />
    ),
  );
};

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
