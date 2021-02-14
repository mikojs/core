// @flow

import { useState, useEffect, useMemo } from 'react';

import useGetMessages, {
  type getMessagesArguType,
  type getMessagesReturnType,
} from './useGetMessages';

export type messagesArguType = {|
  ...getMessagesArguType,
  event: $PropertyType<getMessagesArguType, 'event'> | 'stop',
|};
export type messagesReturnType = getMessagesReturnType;

/**
 * @param {messagesArguType} argu - messages argu
 *
 * @return {messagesReturnType} - messages cache
 */
export default (argu: messagesArguType): messagesReturnType => {
  const getMessages = useGetMessages();
  const [messages, setMessages] = useState<messagesReturnType>([]);
  const [loadingMessages, setLoadingMessages] = useState<messagesReturnType>(
    [],
  );

  useEffect(() => {
    const { name, event } = argu;
    const filteredLoadingMessages = ![
      'start',
      'stop',
      'success',
      'error',
    ].includes(event)
      ? []
      : loadingMessages.filter(
          (message: $ElementType<messagesReturnType, number>) =>
            name !== message.name,
        );
    const newMessages =
      event === 'stop' ? [] : getMessages({ ...argu, name, event });

    switch (event) {
      case 'start':
        setLoadingMessages([...filteredLoadingMessages, ...newMessages]);
        break;

      case 'stop':
        setLoadingMessages(filteredLoadingMessages);
        break;

      case 'success':
      case 'error':
        setLoadingMessages(filteredLoadingMessages);
        setMessages([...messages, ...newMessages]);
        break;

      default:
        setMessages([...messages, ...newMessages]);
        break;
    }
  }, [argu]);

  return useMemo(() => [...messages, ...loadingMessages], [
    messages,
    loadingMessages,
  ]);
};
