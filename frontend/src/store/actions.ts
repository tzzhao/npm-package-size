import {PackageInformation} from 'npm-pkg-utils';
import {Action} from 'redux';
import {PackageState} from './state';

export const SET_LOADING = 'SET_LOADING';
export const SET_PACKAGE_INFOS = 'SET_PACKAGE_INFOS';
export const SET_ERROR = 'SET_ERROR';

export const LoadingAction: () => Action = () => ({
  type: SET_LOADING,
  payload: {
    state: PackageState.LOADING,
    globalError: undefined,
    packageInfos: []
  }
});

export const SetPackageInformationAction: (packageInfos: PackageInformation[]) => Action = (packageInfos: PackageInformation[]) => ({
  type: SET_PACKAGE_INFOS,
  payload: {
    state: PackageState.READY,
    globalError: undefined,
    packageInfos
  }
});

export const SetErrorAction: (globalError: Error) => Action = (globalError: Error) => ({
  type: SET_ERROR,
  payload: {
    state: PackageState.ERROR,
    globalError,
    packageInfos: []
  }
});
