import {PackageInformation} from 'npm-pkg-utils';
import {Action} from 'redux';
import {PackageState, RootState} from './state';

export const SET_LOADING = 'SET_LOADING';
export const SET_PACKAGE_INFOS = 'SET_PACKAGE_INFOS';
export const SET_ERROR = 'SET_ERROR';

export interface LoadActionPayload extends RootState {}

export class LoadingAction implements Action {
  public readonly type: string = SET_LOADING;
  public payload: LoadActionPayload = {
    state: PackageState.LOADING,
    globalError: undefined,
    packageInfos: []
  };
  constructor() {}
}

export interface SetPackageInformationActionPayload extends RootState {}

export class SetPackageInformationAction implements Action {
  public readonly type: string = SET_PACKAGE_INFOS;
  public payload: SetPackageInformationActionPayload;
  constructor(packageInfos: PackageInformation[]){
    this.payload = {
      state: PackageState.READY,
      globalError: undefined,
      packageInfos
    }
  }
}

export interface SetErrorActionPayload extends RootState {}

export class SetErrorActionPayloadAction implements Action {
  public readonly type: string = SET_ERROR;
  public payload: SetErrorActionPayload;
  constructor(globalError: any) {
    this.payload = {
      state: PackageState.ERROR,
      globalError,
      packageInfos: []
    }
  }
}

export type Actions = LoadingAction | SetPackageInformationAction | SetErrorActionPayloadAction;
