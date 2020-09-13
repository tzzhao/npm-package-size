import React from 'react';
import {Bar, BarProperties} from './Bar';

export interface BarGraphProps {
  barsProps: BarProperties[]
}

export function BarGraph(props: BarGraphProps) {
  const bars = props.barsProps.map((barProp, index) => {
    return <Bar key={barProp.name + index} {...barProp} />;
  });
  return (
      <div>
        {bars}
      </div>
  );
}
