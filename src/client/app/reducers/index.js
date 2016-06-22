import {combineReducers} from 'redux';
import {listReducer} from './list.reducer';
import {isochrones} from './isochrones';
import {assignmentReducer} from './assignments';
import {groupReducer} from './groups';
import {projectReducer} from './project';

let reducer = combineReducers({
  project: projectReducer,
  workers: listReducer('WORKER_'),
  groups: groupReducer,
  tasks: listReducer('TASK_'),
  isochrones: isochrones,
  assignments: assignmentReducer
});

export {reducer};
