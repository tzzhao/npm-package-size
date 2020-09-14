import {PackageInformation} from 'npm-pkg-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';
import {createStore, Store} from 'redux';
import GlobalError from './components/Error/GlobalError';
import {Loading} from './components/Loading/Loading';
import PackageInfoGraph from './components/PackageInfoGraph/PackageInfoGraph';
import {Search} from './components/Search/Search';
import {LoadingAction, SetErrorActionPayloadAction, SetPackageInformationAction} from './store/actions';
import {reducer} from './store/reducers';
import {initialState, PackageState, RootState} from './store/state';

const store: Store = createStore(reducer, initialState);

type AppProperties = {
  state: PackageState
}

const onSearch = (packageName: string) => {
  store.dispatch(LoadingAction());
  fetch(`/getLatestPackagesSize?packageName=${packageName}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data) && (data as Array<any>).some(el => el.size)) {
          // Expected response should be an array of PackageInformation with positive sizes
          store.dispatch(SetPackageInformationAction(data as PackageInformation[]));
        } else if (data.name) {
          // If the error was caught and returned by the backend, it should contain a name
          store.dispatch(SetErrorActionPayloadAction(data));
        } else {
          // Generic error case
          store.dispatch(SetErrorActionPayloadAction({name: 'GenericError', message: `There was an issue processing ${packageName}`}));
        }
      })
      .catch(error => store.dispatch(SetErrorActionPayloadAction(error)));
};

let App: React.FC<Partial<AppProperties>> = props => {
  let element;
  switch(props.state) {
    case PackageState.LOADING:
      element = <Loading/>;
      break;
    case PackageState.ERROR:
      element = <GlobalError/>;
      break;
    default:
      element = <PackageInfoGraph />;
  }
  return (
      <div>
        <div className="header">
          <h1>Find npm package sizes</h1>
          <div>Search for npm packages minified and bundled sizes.</div>
          <div>Hover on the histogram to get the sizes</div>
        </div>
        <Search onSearch={onSearch}/>
        <div className="display-container">
          {element}
        </div>
      </div>
  )
};

const mapStateToProps = (state: RootState) => {
  return { state: state.state};
};

App = connect(mapStateToProps)(App);

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
);
