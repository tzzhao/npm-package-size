import {render, RenderResult} from '@testing-library/react';
import {PackageError, PackageInformation} from 'npm-pkg-utils';
import * as React from 'react';
import {act} from 'react-test-renderer';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';
import {createStore, Store} from 'redux';
import {SetPackageInformationAction} from '../../store/actions';
import {reducer} from '../../store/reducers';
import {initialState} from '../../store/state';
import {
  TEST_PACKAGE_INFO_1,
  TestSetEmptyPackageInformationAction,
  TestSetPackageInformationAction,
} from '../../utils/test/store/actions';
import {PackageInfoGraph} from './PackageInfoGraph';

const store: Store = createStore(reducer, initialState);

test('Test package info graph is empty when package infos are empty', () => {
  act(() => {
    store.dispatch(TestSetEmptyPackageInformationAction);
  });

  const renderResult: RenderResult = render(<Provider store={store}><PackageInfoGraph /></Provider>);
  expect(renderResult.baseElement.textContent).toBe("");
});

test('Test package info graph with 2 package information - SNAPSHOT', () => {
  act(() => {
    store.dispatch(TestSetPackageInformationAction);
  });

  const component = renderer.create(<Provider store={store}><PackageInfoGraph /></Provider>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test('Test package info graph with 1 missing package information - SNAPSHOT', () => {
  const MISSING_PACKAGE_ERROR: PackageError = {
    pkgName: 'package',
    pkgVersion: '1.0.2',
    name: 'NpmError',
    message: 'Some error message'
  };

  act(() => {
    store.dispatch(SetPackageInformationAction([TEST_PACKAGE_INFO_1, MISSING_PACKAGE_ERROR as any as PackageInformation]));
  });

  const component = renderer.create(<Provider store={store}><PackageInfoGraph /></Provider>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
