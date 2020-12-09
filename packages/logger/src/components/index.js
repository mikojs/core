// @flow

import EventEmitter from 'events';

import React, {
  type AbstractComponent as AbstractComponentType,
  type Node as NodeType,
  useEffect,
  useState,
} from 'react';

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
    // FIXME: should keep watch
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

  return <Table logs={logs} />;
};

export default (React.memo<propsType>(
  Logger,
): AbstractComponentType<propsType>);
