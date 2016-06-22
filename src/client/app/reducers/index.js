import {combineReducers} from 'redux';
import {listReducer} from './list.reducer';
import {isochrones} from './isochrones';
import {assignmentReducer} from './assignments';
import {groupReducer} from './groups';
import {settingReducer} from './settings';

let reducer = combineReducers({
  settings: settingReducer,
  workers: listReducer('WORKER_'),
  groups: groupReducer,
  tasks: listReducer('TASK_'),
  isochrones: isochrones,
  assignments: assignmentReducer
});

export {reducer};
