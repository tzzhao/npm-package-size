import {PackageInformation} from 'npm-pkg-utils';
import React from 'react';
import ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';
import {createStore, Store} from 'redux';
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
  store.dispatch(new LoadingAction());
  fetch(`/getLatestPackagesSize?packageName=${packageName}`)
      .then(response => response.json())
      .then(data => store.dispatch(new SetPackageInformationAction(data as PackageInformation[])))
      .catch(error => store.dispatch(new SetErrorActionPayloadAction(error)));
};

let App: React.FC<Partial<AppProperties>> = () => {
  return (
      <div>
        <Search onSearch={onSearch}/>
        <PackageInfoGraph />
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
