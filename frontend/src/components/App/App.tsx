import {Dispatch} from 'redux';
import {PackageState, RootState} from "../../store/state";
import {LoadingAction, SetErrorAction, SetPackageInformationAction} from "../../store/actions";
import {PackageInformation} from "npm-pkg-utils";
import React from "react";
import {Loading} from "../Loading/Loading";
import {GlobalError} from "../Error/GlobalError";
import {PackageInfoGraph} from "../PackageInfoGraph/PackageInfoGraph";
import {connect, useDispatch} from 'react-redux';
import {PackageSearch} from '../PackageSearch/PackageSearch';

type AppProperties = {
  state: PackageState
}

const AppNotConnected: React.FC<Partial<AppProperties>> = props => {
  let mainSectionElement;
  switch(props.state) {
    case PackageState.LOADING:
      mainSectionElement = <Loading/>;
      break;
    case PackageState.ERROR:
      mainSectionElement = <GlobalError/>;
      break;
    default:
      mainSectionElement = <PackageInfoGraph />;
  }

  const dispatch = useDispatch();

  return (
      <div>
        <div className="header">
          <h1>Find npm package sizes</h1>
          <div>Search for npm packages minified and bundled sizes.</div>
          <div>Hover on the histogram to get the sizes</div>
        </div>
        <PackageSearch onSearch={onSearch(dispatch)}
                defaultValue="react"
                disabled={props.state === PackageState.LOADING}
                disabledTooltipMessage="Wait for the current request to end before making a new one"
                inputName="Package name"/>
        <div className="display-container">
          {mainSectionElement}
        </div>
      </div>
  )
};

function onSearch(dispatch: Dispatch): (packageName: string) => void {
  return (packageName: string) => {
    dispatch(LoadingAction());
    fetch(`/getLatestPackagesSizeV2?packageName=${packageName}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && (data as Array<any>).some(el => el.size)) {
            // Expected response should be an array of PackageInformation with positive sizes
            dispatch(SetPackageInformationAction(data as PackageInformation[]));
          } else if (data.name) {
            // If the error was caught and returned by the backend, it should contain a name
            dispatch(SetErrorAction(data));
          } else {
            // Generic error case
            dispatch(SetErrorAction({name: 'GenericError', message: `There was an issue processing ${packageName}`}));
          }
        })
        .catch(error => dispatch(SetErrorAction(error)));
  }
}

const mapStateToAppProps = (state: RootState) => {
  return { state: state.state};
};

export const App = connect(mapStateToAppProps)(AppNotConnected);
