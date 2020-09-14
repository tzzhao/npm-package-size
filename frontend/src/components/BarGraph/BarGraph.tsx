import React, {ReactElement} from 'react';
import {Bar, BarProperties} from './Bar';

export interface BarGraphProps {
  barsProps: BarProperties[],
}

export function BarGraph(props: BarGraphProps): ReactElement {
  const bars = props.barsProps.map((barProp, index) => {
    return <Bar key={barProp.name + index} {...barProp} />;
  });
  const legends = props.barsProps.map((barProp, index) => {
    return <div key={barProp.name + index} className="bar-legend">{barProp.name}</div>
  });
  return (
      <div className="bar-graph">
        <div className="bars-container">
          {bars}
        </div>
        <div className="bars-legend-container">
          {legends}
        </div>
      </div>
  );
}
