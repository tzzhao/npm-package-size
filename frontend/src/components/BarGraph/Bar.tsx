import React from 'react';
import {Tooltip} from '@material-ui/core';

export interface BarProperties {
  height: string;
  color: string
  description: string;
  name: string;
}

export function Bar(props: BarProperties) {
  return (
      <Tooltip title={props.description}>
        <div className="bar" style={{height: props.height, backgroundColor: props.color}} />
      </Tooltip>);
}
