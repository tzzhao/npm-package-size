import {SET_ERROR, SET_LOADING, SET_PACKAGE_INFOS} from './actions';
import {initialState, RootState} from './state';

export const reducer = ((state: RootState = initialState, action: {type: string, payload: RootState}) => {
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
