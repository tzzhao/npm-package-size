import {createStore, Store} from 'redux';
import {reducer} from './reducers';
import {initialState} from './state';

export const store: Store = createStore(reducer, initialState, (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__());
