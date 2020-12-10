// @flow

import EventEmitter from 'events';

import React, {
  type AbstractComponent as AbstractComponentType,
  type Node as NodeType,
  useEffect,
  useState,
} from 'react';
import { emptyFunction } from 'fbjs';

import Table, {
  type eventType,
  type propsType as tablePropsType,
} from './Table';

type propsType = {|
  events: EventEmitter,
|};

export type stateType = $PropertyType<tablePropsType, 'logs'>;

/** @react logger controller */
const Logger = ({ events }: propsType): NodeType => {
  const [logs, setLogs] = useState<stateType>({});

  useEffect(() => {
    const interval = setInterval(emptyFunction, 1000);

    events.on(
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
          const newLogs = {
            ...prevLogs,
            [name]: {},
          };

          switch (event) {
            case 'success':
              newLogs[name].success = [
                ...(newLogs[name].success || []),
                message,
              ];
              break;

            case 'fail':
              newLogs[name].fail = [...(newLogs[name].fail || []), message];
              break;

            case 'end':
              clearInterval(interval);
              break;

            default:
              break;
          }

          return newLogs;
        });
      },
    );
    events.emit('end');
  }, [events]);

  return <Table logs={logs} />;
};

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
