import React from 'react';
import {RootState} from "../../store/state";
import {connect} from "react-redux";

export interface ErrorProperties {
  error: Error | undefined;
}

const GlobalErrorNotConnected: React.FC<Partial<ErrorProperties>> = props => {
  if (!props.error) return null;
  return (
      <div className="global-error">
        The following error occurred: [{props.error?.name}] {props.error?.message ? props.error.message: ''}
      </div>
  )
};

const mapStateToGlobalErrorProps = (state: RootState) => {
  return {
    error: state.globalError
  };
};

export const GlobalError = connect(mapStateToGlobalErrorProps)(GlobalErrorNotConnected);
