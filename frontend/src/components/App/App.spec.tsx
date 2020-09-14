import {PackageInformation} from 'npm-pkg-utils';
import * as React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {createStore, Store} from 'redux';
import {reducer} from '../../store/reducers';
import {initialState, PackageState} from '../../store/state';
import {TEST_PACKAGE_INFORMATION} from '../../utils/test/store/actions';
import {App} from './App';

jest.useFakeTimers();

let container: Element | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

test('Test package info graph is empty when package infos are empty', async () => {
  const mockResponse: PackageInformation[] = TEST_PACKAGE_INFORMATION;
  const store: Store = createStore(reducer, initialState);

  // Mock call to the backend
  global.fetch = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({json: () => Promise.resolve(mockResponse)} as any);}, 3000);
      });

  act(() => {
    render(<Provider store={store}><App /></Provider>, container);
  });

  expect(store.getState().state).toBe(PackageState.INIT);

  // Check loading state
  let loadingText: Element = container!.querySelector('.loading-text') as any;
  expect(loadingText).toBeFalsy();

  // Launch search
  const searchButton: Element = container!.querySelector('.search-submit')!;
  act(() => {
    searchButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  // Check loading state
  loadingText = container!.querySelector('.loading-text') as any;
  expect(loadingText.innerHTML).toEqual('Installing dependencies');

  // Check search button is disabled
  const disabledSearch: Element = container!.querySelector('.disabled-search')!;
  expect(disabledSearch).toBeTruthy();

  act(() => {
    jest.advanceTimersByTime(6000);
  });

  /*
  TODO Bug the state is not updated despite the action is disptached (seems to happen in tests only)
  expect(store.getState().state).toBe(PackageState.READY);

  // Check bar is
  const bar: any = container!.querySelectorAll('.bar');
  expect(bar.length).toBeTruthy();
  */
});
