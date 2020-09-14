import {
  TEST_ERROR_MESSAGE,
  TEST_ERROR_NAME,
  TEST_PACKAGE_INFORMATION,
  TestLoadingAction, TestSetErrorAction,
  TestSetPackageInformationAction,
} from '../utils/test/store/actions';
import {reducer} from './reducers';
import {initialState, PackageState, RootState} from './state';

test('Test loading action', () => {
  const nextState: RootState = reducer(initialState, TestLoadingAction);

  expect(nextState.state).toBe(PackageState.LOADING);
  expect(nextState.packageInfos).toStrictEqual([]);
  expect(nextState.globalError).toBeUndefined();
});

test('Test set package infos action', () => {
  const loadingState: RootState = reducer(initialState, TestLoadingAction);
  const nextState: RootState = reducer(loadingState, TestSetPackageInformationAction);

  expect(nextState.state).toBe(PackageState.READY);
  expect(nextState.packageInfos).toStrictEqual(TEST_PACKAGE_INFORMATION);
  expect(nextState.globalError).toBeUndefined();
});

test('Test set global error action', () => {
  const loadingState: RootState = reducer(initialState, TestLoadingAction);
  const nextState: RootState = reducer(loadingState, TestSetErrorAction);

  expect(nextState.state).toBe(PackageState.ERROR);
  expect(nextState.packageInfos).toStrictEqual([]);
  expect(nextState.globalError).toStrictEqual({name: TEST_ERROR_NAME, message: TEST_ERROR_MESSAGE});
});

test('Test other actions do not affect state', () => {
  const nextState: RootState = reducer(initialState, {
    type: 'irrelevant action type',
    payload: {state: PackageState.LOADING, globalError: undefined, packageInfos: TEST_PACKAGE_INFORMATION}
  });
  expect(nextState).toBe(initialState);
});
