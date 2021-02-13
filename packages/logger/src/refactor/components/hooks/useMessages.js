// @flow

import { useState, useEffect, useMemo } from 'react';

import useGetMessages, {
  type getMessagesArguType,
  type getMessagesReturnType,
} from './useGetMessages';

export type messagesArguType = getMessagesArguType;
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

    if (event === 'start')
      setLoadingMessages([
        ...loadingMessages.filter(
          (message: $ElementType<messagesReturnType, number>) =>
            name === message.name,
        ),
        ...getMessages(argu),
      ]);
    else setMessages([...messages, ...getMessages(argu)]);
  }, [argu]);

  return useMemo(() => [...messages, ...loadingMessages], [
    messages,
    loadingMessages,
  ]);
};
