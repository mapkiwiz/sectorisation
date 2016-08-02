import * as actions from '../actions/assignments';

let initialState = {
  selectedWorker: undefined,
  tasks: {},
  groups: {},
  workers: {}
};

function assignTaskToWorker(state, taskId, workerId) {

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

function unassignTask(state, taskId) {

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

function assignGroup(state, group, workerId) {
  // iterate over tasks
  group.tasks.forEach(taskId => {
    state = assignTaskToWorker(state, taskId, workerId)
  });
  group.assignedTo = workerId;
  return {
    ...state,
    groups: {
      ...state.groups,
      [group.id]: workerId }
  };
}

function unassignGroup(state, group) {
  // iterate over tasks
  group.tasks.forEach(taskId => {
    state = unassignTask(state, taskId);
  });
  group.assignedTo = undefined;
  return {
    ...state,
    groups: {
      ...state.groups,
      [group.id]: undefined }
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

    case actions.assignGroup.ACTION_TYPE:
      return assignGroup(
        state,
        action.group,
        action.worker && action.worker.id || state.selectedWorker);

    case actions.unassignGroup.ACTION_TYPE:
      return unassignGroup(state, action.group);

    case actions.toggleGroupAssignment.ACTION_TYPE:
      var workerId = action.worker && action.worker.id || state.selectedWorker;
      if (action.group.assignedTo == workerId) {
        return unassignGroup(state, action.group);
      } else {
        return assignGroup(state, action.group, workerId);
      }

    case actions.assignTask.ACTION_TYPE:
      var workerId = action.worker && action.worker.id || state.selectedWorker;
      return assignTaskToWorker(state, action.task.id, workerId);

    case actions.unassignTask.ACTION_TYPE:
      return unassignTask(state, action.task.id);

    case actions.toggleTaskAssignment.ACTION_TYPE:
      var workerId = action.worker && action.worker.id || state.selectedWorker;
      if (state.tasks[action.task.id] == workerId) {
        return unassignTask(state, action.task.id);
      } else {
        return assignTaskToWorker(state, action.task.id, workerId);
      }

    case actions.setGroupAssignments.ACTION_TYPE:
          for (var groupId in action.assignments) {
            if (action.assignments.hasOwnProperty(groupId)) {
              var group = action.groups[groupId];
              var workerId = action.assignments[groupId];
              state = assignGroup(state, group, workerId);
            }
          }
          return state;

    default:
      return state;

  }

}
