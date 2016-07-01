

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

  let previousWorker = state.tasks[taskId];
  let st = {
    selectedWorker: state.selectedWorker,
    groups: state.groups,
    tasks: { ...state.tasks, [taskId]: undefined },
    workers: { ...state.workers }
  };

  if (previousWorker) st.workers[previousWorker] -= 1;
  return st;

}

function assignGroup(state, action) {
  console.log("Assign group to " + state.selectedWorker);
  // iterate over tasks
  action.tasks.forEach(taskId => {
    state = assignTaskToSelectedWorker(state, taskId)
  });
  action.group.assignedTo = state.selectedWorker;
  return {
    ...state,
    groups: {
      ...state.groups,
      [action.group.id]: state.selectedWorker }
  };
}

function unassignGroup(state, action) {
  console.log("Unassign group");
  // iterate over tasks
  action.tasks.forEach(taskId => {
    state = unassignTask(state, taskId);
  });
  action.group.assignedTo = undefined;
  return {
    ...state,
    groups: {
      ...state.groups,
      [action.group.id]: undefined }
  };
}

export function assignmentReducer(state = initialState, action) {
  switch (action.type) {
    case 'WORKER_SELECT':
    case 'WORKER_SELECT_ONE':
      return { ...state, selectedWorker: action.id };
    case 'WORKER_TOGGLE':
    case 'WORKER_TOGGLE_ONE':
      if (state.selectedWorker == action.id) {
        return { ...state, selectedWorker: undefined };
      } else {
        return { ...state, selectedWorker: action.id };
      }
    case 'WORKER_UNSELECT':
      return { ...state, selectedWorker: undefined };
    case 'GROUP_ASSIGN':
      // if (action.hasOwnProperty('worker')) {
      //  state.selectedWorker = action.worker;
      // }
      return assignGroup(state, action);
    case 'GROUP_UNASSIGN':
      return unassignGroup(state, action);
    case 'GROUP_TOGGLE_ASSIGN':
      if (action.group.assignedTo == state.selectedWorker) {
        return unassignGroup(state, action);
      } else {
        return assignGroup(state, action);
      }
    case 'TASK_ASSIGN_TO_SELECTED_WORKER':
      return assignTaskToSelectedWorker(state, action.task.id);
    case 'TASK_UNASSIGN':
      return unassignTask(state, action.task.id);
    default:
      return state;
  }
}
