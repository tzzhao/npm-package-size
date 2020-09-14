import {PackageInformation} from 'npm-pkg-utils';
import {LoadingAction, SetErrorAction, SetPackageInformationAction} from '../../../store/actions';

export const TestLoadingAction = LoadingAction();

export const TEST_ERROR_NAME = 'GlobalError';
export const TEST_ERROR_MESSAGE = '[global error message]';
export const TestSetErrorAction = SetErrorAction({name: TEST_ERROR_NAME, message: TEST_ERROR_MESSAGE});

export const TestSetEmptyPackageInformationAction = SetPackageInformationAction([]);

export const TEST_PACKAGE_INFO_1: PackageInformation =   {
  size: 15203,
  gzip: 120,
  pkgName: 'package',
  pkgVersion: '1.0.1'
};
export const TEST_PACKAGE_INFO_2: PackageInformation =   {
  size: 152231203,
  gzip: 122310,
  pkgName: 'package',
  pkgVersion: '1.2.1'
};
export const TEST_PACKAGE_INFORMATION: PackageInformation[] = [
  TEST_PACKAGE_INFO_1,
  TEST_PACKAGE_INFO_2
];
export const TestSetPackageInformationAction = SetPackageInformationAction(TEST_PACKAGE_INFORMATION);
