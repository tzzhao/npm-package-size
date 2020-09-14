import {useEffect} from 'react';
import * as React from 'react';

const steps: string[] = ['Installing dependencies', 'Compiling package', 'Computing bundle size'];

export const Loading: React.FC = () => {
  const [step, setStep] = React.useState(0);
  useEffect(() => {
    if (step < 2) {
      const timeoutId = setTimeout(() => setStep(step + 1), 5000);
      // If the component unmounts, clear the timeout
      return () => {
        clearTimeout(timeoutId);
      }
    }
    return () => {};
  });
  return (
      <div className="loading-container">
        <div className="loading-text">{steps[step]}</div>
        <div className="loading-wrapper">
          <div className="loading"/>
        </div>
      </div>);
};
