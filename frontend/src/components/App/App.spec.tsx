import {PackageInformation} from 'npm-pkg-utils';
import * as React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
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

test('IT test for a call that succeeds', async (done) => {
  const mockResponse: PackageInformation[] = TEST_PACKAGE_INFORMATION;

  // Mock call to the backend
  global.fetch = () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({json: () => Promise.resolve(mockResponse)} as any);}, 100);
      });

  const store = createStore(reducer, initialState);

  act(() => {
    render(<Provider store={store}><App /></Provider>, container);
  });

  /************************ INITIAL STATE *************************************/
  expect(store.getState().state).toBe(PackageState.INIT);

  // Check loading state is not displayed
  let loadingText: Element = container!.querySelector('.loading-text') as any;
  expect(loadingText).toBeFalsy();

  /************************ LOADING STATE *************************************/
  // Launch search
  const searchButton: HTMLInputElement = container!.querySelector<HTMLInputElement>('.search-submit')!;
  act(() => {
    searchButton.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });

  await act(async () => {
    jest.advanceTimersByTime(10);
  });

  // Check loading state
  loadingText = container!.querySelector('.loading-text') as any;
  expect(loadingText.innerHTML).toEqual('Installing dependencies');

  // Check search button is disabled
  expect(searchButton.disabled).toBeTruthy();

  /************************ READY STATE *************************************/
  //
  await act(async () => {
    jest.advanceTimersByTime(200);
  });

  // Check store state is correctly updated
  expect(store.getState().state).toBe(PackageState.READY);

  // Check loading is not displayed
  loadingText = container!.querySelector('.loading-text') as any;
  expect(loadingText).toBeFalsy();

  // Check search button is enabled
  expect(searchButton.disabled).toBeFalsy();

  // Check 2 bars are displayed
  const bar: any = container!.querySelectorAll('.bar');
  expect(bar.length).toBe(4);

  done();
});
