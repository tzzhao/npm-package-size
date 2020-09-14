import {PackageInformation} from 'npm-pkg-utils';
import {PackageState} from './state';

export const SET_LOADING = 'SET_LOADING';
export const SET_PACKAGE_INFOS = 'SET_PACKAGE_INFOS';
export const SET_ERROR = 'SET_ERROR';

export const LoadingAction = () => ({
  type: SET_LOADING,
  payload: {
    state: PackageState.LOADING,
    globalError: undefined,
    packageInfos: []
  }
});

export const SetPackageInformationAction = (packageInfos: PackageInformation[]) => ({
  type: SET_PACKAGE_INFOS,
  payload: {
    state: PackageState.READY,
    globalError: undefined,
    packageInfos
  }
});

export const SetErrorAction = (globalError: Error) => ({
  type: SET_ERROR,
  payload: {
    state: PackageState.ERROR,
    globalError,
    packageInfos: []
  }
});
