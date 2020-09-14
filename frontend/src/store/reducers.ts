import {Reducer} from 'redux';
import {Action, SET_ERROR, SET_LOADING, SET_PACKAGE_INFOS} from './actions';
import {initialState, RootState} from './state';

export const reducer : Reducer<RootState, Action> = ((state: RootState = initialState, action: Action) => {
  switch(action.type) {
    case SET_LOADING:
      return {...state, ...action.payload};
    case SET_PACKAGE_INFOS:
      return {...state, ...action.payload};
    case SET_ERROR:
      return {...state, ...action.payload};
    default:
      return state;
  }
});
