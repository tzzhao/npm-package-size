import {PackageBaseInfo} from './PackageBaseInfo';

export interface PackageInformation extends PackageBaseInfo {
  size: number,
  gzip: number
}
