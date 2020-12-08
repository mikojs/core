// @flow

import EventEmitter from 'events';

import React, {
  type AbstractComponent as AbstractComponentType,
  type Node as NodeType,
  useEffect,
  useState,
} from 'react';
import { Text } from 'ink';

type eventType = 'success' | 'fail';
type propsType = {|
  events: EventEmitter,
|};

export type stateType = {|
  [string]: {|
    [eventType]: $ReadOnlyArray<string>,
  |},
|};

/** @react logger controller */
const Logger = ({ events }: propsType): NodeType => {
  const [, setLogs] = useState<stateType>({});

  useEffect(() => {
    events.addListener(
      'update',
      ({
        name,
        event,
        message,
      }: {|
        name: string,
        event: eventType,
        message: string,
      |}) => {
        setLogs((prevLogs: stateType): stateType => {
          switch (event) {
            case 'success':
              prevLogs[name].success = [
                ...(prevLogs[name].success || []),
                message,
              ];
              break;

            case 'fail':
              prevLogs[name].fail = [...(prevLogs[name].fail || []), message];
              break;

            default:
              break;
          }

          return prevLogs;
        });
      },
    );
  }, [events]);

  return <Text>Hello world</Text>;
};

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
