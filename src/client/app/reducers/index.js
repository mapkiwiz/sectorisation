import {combineReducers} from 'redux';
import {listReducer} from './list.reducer';
import {isochrones} from './isochrones';

let reducer = combineReducers({
  workers: listReducer('WORKER_'),
  groups: listReducer('GROUP_'),
  tasks: listReducer('TASK_'),
  isochrones: isochrones
});

export {reducer};
