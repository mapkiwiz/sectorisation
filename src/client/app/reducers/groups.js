import {listReducer, initialState} from './list.reducer';

let groupListReducer = listReducer('GROUP_');
let groupInitialState = { ...initialState, previousToggleId: undefined };

function setGroupSelection(state, workerId) {
  let selected = state.items.filter(
    item => item.assignedTo == workerId
  ).map(
    item => item.id
  );
  return { ...state, selected: selected };
}

function resetGroupSelection(state) {
  return { ...state, selected: [] };
}

export function groupReducer(state = groupInitialState, action) {
  switch (action.type) {
    case 'WORKER_SELECT':
    case 'WORKER_SELECT_ONE':
      state.previousToggleId = undefined;
      return setGroupSelection(state, action.id);
    case 'WORKER_TOGGLE':
    case 'WORKER_TOGGLE_ONE':
      if (state.previousToggleId == action.id) {
        state.previousToggleId = undefined;
        return resetGroupSelection(state);
      } else {
        state.previousToggleId = action.id;
        return setGroupSelection(state, action.id);
      }
    case 'WORKER_UNSELECT':
      state.previousToggleId = undefined;
      return resetGroupSelection(state);
    default:
      return groupListReducer(state, action);
  }
}
