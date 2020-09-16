import React, {ReactElement, useEffect, useState} from 'react';
import {Tooltip} from '@material-ui/core';

export interface BarProperties {
  height: string;
  color: string
  description: string;
  name: string;
}

export function Bar(props: BarProperties): ReactElement {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 10);
    return () => clearTimeout(timer);
  });

  return (
      <div className="bar-container" >
        <Tooltip title={props.description} arrow placement="top">
          <div className="bar" style={{height: (show ? props.height : 0), marginTop: (show? 0 : props.height), backgroundColor: props.color}} />
        </Tooltip>
      </div>);
}
