import React from 'react';
import {Tooltip} from '@material-ui/core';

export interface BarProperties {
  height: string;
  width: string;
  description: string;
  name: string;
}

export function Bar(props: BarProperties) {
  return (
      <Tooltip title={props.description}>
        <div style={{height: props.height, width: props.width}} />
      </Tooltip>);
}
