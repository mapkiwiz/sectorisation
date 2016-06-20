import {combineReducers} from 'redux';
import {listReducer} from './list.reducer';
import {isochrones} from './isochrones';
import {assignmentReducer} from './assignments';

let reducer = combineReducers({
  workers: listReducer('WORKER_'),
  groups: listReducer('GROUP_'),
  tasks: listReducer('TASK_'),
  isochrones: isochrones,
  assignments: assignmentReducer
});

export {reducer};
