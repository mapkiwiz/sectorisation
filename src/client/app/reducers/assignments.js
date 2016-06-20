

let initialState = {
  selectedWorker: undefined,
  tasks: {},
  groups: {},
  workers: {}
};

export function assignTaskToSelectedWorker(state, taskId) {

  let workerId = state.selectedWorker;
  if (!workerId) return state;

  let previousWorker = state.tasks[taskId];
  let st = {
    selectedWorker: state.selectedWorker,
    groups: state.groups,
    tasks: { ...state.tasks, [taskId]: workerId },
    workers: { ...state.workers, [workerId]: (state.workers[workerId] || 0)+1 }
  };

  if (previousWorker) st.workers[previousWorker] -= 1;
  return st;

}

export function unassignTask(state, taskId) {

  let workerId = state.selectedWorker;
  if (!workerId) return state;

  let previousWorker = state.tasks[taskId];
  let st = {
    selectedWorker: state.selectedWorker,
    groups: state.groups,
    tasks: { ...state.tasks, [taskId]: workerId },
    workers: { ...state.workers }
  };

  if (previousWorker) st.workers[previousWorker] -= 1;
  return st;

}

export function _assignmentReducer(state = initialState, action) {
  switch (action.type) {
    case 'WORKER_SELECT':
    case 'WORKER_SELECT_ONE':
      return { ...state, selectedWorker: action.id };
    case 'WORKER_UNSELECT':
      return { ...state, selectedWorker: undefined };
    case 'GROUP_ASSIGN_TO_SELECTED_WORKER':
      // iterate over tasks
      action.tasks.forEach(taskId => {
        state = assignTaskToSelectedWorker(state, taskId)
      });
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.group]: state.selectedWorker }
      };
    case 'GROUP_UNASSIGN':
      // iterate over tasks
      action.tasks.forEach(taskId => {
        state = unassignTask(state, taskId);
      });
      return {
        ...state,
        groups: {
          ...state.groups,
          [action.group]: undefined }
      };
    case 'TASK_ASSIGN_TO_SELECTED_WORKER':
      return assignTaskToSelectedWorker(state, action.taskId);
    case 'TASK_UNASSIGN':
      return unassignTask(state, action.taskId);
    default:
      return state;
  }
}

export function assignmentReducer(state = initialState, action) {
  console.log(action);
  let _state = _assignmentReducer(state, action);
  console.log(_state);
  return _state;
}
