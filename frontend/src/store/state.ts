import {PackageInformation} from 'npm-pkg-utils';

export enum PackageState {
  INIT, LOADING, READY, ERROR
}

export interface RootState {
  state: PackageState,
  packageInfos: PackageInformation[],
  globalError: any | undefined
}

export const initialState: RootState = {
  state: PackageState.INIT,
  packageInfos: [],
  globalError: undefined
};
