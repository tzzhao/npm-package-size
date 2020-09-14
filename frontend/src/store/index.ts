import {createStore, Store} from 'redux';
import {reducer} from './reducers';
import {initialState} from './state';

export const store: Store = createStore(reducer, initialState);
