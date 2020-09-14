import {render, RenderResult} from '@testing-library/react';
import * as React from 'react';
import {Provider} from 'react-redux';
import renderer from 'react-test-renderer';
import {createStore, Store} from 'redux';
import {reducer} from '../../store/reducers';
import {initialState} from '../../store/state';
import {
  TEST_ERROR_MESSAGE,
  TEST_ERROR_NAME,
  TestLoadingAction,
  TestSetErrorAction,
  TestSetPackageInformationAction,
} from '../../utils/test/store/actions';
import {GlobalError} from './GlobalError';

const store: Store = createStore(reducer, initialState);

test('Test error is empty on init', () => {
  const renderResult: RenderResult = render(<Provider store={store}><GlobalError /></Provider>);
  expect(renderResult.baseElement.textContent).toBe("");
});

test('Test error is empty during loading', () => {
  store.dispatch(TestLoadingAction);
  const renderResult: RenderResult = render(<Provider store={store}><GlobalError /></Provider>);
  expect(renderResult.baseElement.textContent).toBe("");
});

test('Test error is empty on ready', () => {
  store.dispatch(TestSetPackageInformationAction);
  const renderResult: RenderResult = render(<Provider store={store}><GlobalError /></Provider>);
  expect(renderResult.baseElement.textContent).toBe("");
});

test('Test error is displayed properly on global error', () => {
  store.dispatch(TestSetErrorAction);
  const renderResult: RenderResult = render(<Provider store={store}><GlobalError /></Provider>);
  expect(renderResult.baseElement.textContent).toBe(`The following error occurred: [${TEST_ERROR_NAME}] ${TEST_ERROR_MESSAGE}`);
});

test('Test error is displayed properly on global error - SNAPSHOT', () => {
  store.dispatch(TestSetErrorAction);
  const component = renderer.create(<Provider store={store}><GlobalError /></Provider>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
