import React from 'react';
import {RootState} from "../../store/state";
import {connect} from "react-redux";

interface ErrorProperties {
  error: Error | undefined;
}

let GlobalError: React.FC<Partial<ErrorProperties>> = props => {
  if (!props.error) return null;
  return (
      <div className="global-error">
        The following error occurred: [{props.error?.name}] {props.error?.message ? props.error.message: ''}
      </div>
  )
};

const mapStateToProps = (state: RootState) => {
  return {
    error: state.globalError
  };
};

GlobalError = connect(mapStateToProps)(GlobalError);

export default GlobalError;
