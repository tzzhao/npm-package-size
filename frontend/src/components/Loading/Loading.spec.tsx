import * as React from 'react';
import {unmountComponentAtNode, render} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {createStore, Store} from 'redux';
import {reducer} from '../../store/reducers';
import {initialState} from '../../store/state';
import {TestLoadingAction} from '../../utils/test/store/actions';
import {Loading} from './Loading';

const store: Store = createStore(reducer, initialState);

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

test('Test package info graph is empty when package infos are empty', () => {
  store.dispatch(TestLoadingAction);
  act(() => {
    render(<Loading />, container);
  });
  const loadingText: HTMLElement = container!.querySelector('.loading-text') as any;
  expect(loadingText.innerHTML).toEqual('Installing dependencies');
  act(() => {
    jest.advanceTimersByTime(4000);
  });
  expect(loadingText.innerHTML).toEqual('Compiling package');
  act(() => {
    jest.advanceTimersByTime(4000);
  });
  expect(loadingText.innerHTML).toEqual('Computing bundle size');
});
