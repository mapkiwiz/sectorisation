/**
 * Assign group of tasks to worker.
 *
 * @param group :object
 * @param worker :object
 *   pass undefined to assign to currently selected worker
 * @returns {{type: string, group: *, worker: *}}
 */
export function assignGroup(group, worker) {
  return {
    type: assignGroup.ACTION_TYPE,
    group: group,
    worker: worker
  };
}
assignGroup.ACTION_TYPE = 'GROUP_ASSIGN';

/**
 * Unassign group of tasks if assigned
 * and push back to available tasks pool.
 *
 * @param group :object
 * @returns {{type: string, group: *}}
 */
export function unassignGroup(group) {
  return {
    type: unassignGroup.ACTION_TYPE,
    group: group
  };
}
unassignGroup.ACTION_TYPE = 'GROUP_UNASSIGN';

/**
 * If group of tasks is not already assigned to given worker,
 * assign group to worker ;
 * otherwise, unassign group of tasks
 * and push back to available tasks pool.
 *
 * @param group :object
 * @param worker :object
 *   pass undefined to assign to currently selected worker
 * @returns {{type: string, group: *, worker: *}}
 */
export function toggleGroupAssignment(group, worker) {
  return {
    type: toggleGroupAssignment.ACTION_TYPE,
    group: group,
    worker: worker
  }
}
toggleGroupAssignment.ACTION_TYPE = 'GROUP_TOGGLE_ASSIGN';

/**
 * Assign task to worker.
 *
 * @param task :object
 * @param worker :object
 *   pass undefined to assign to currently selected worker
 * @returns {{type: string, task: *, worker: *}}
 */
export function assignTask(task, worker) {
  return {
    type: assignTask.ACTION_TYPE,
    task: task,
    worker: worker
  };
}
assignTask.ACTION_TYPE = 'TASK_ASSIGN_TO_SELECTED_WORKER';

/**
 * Unassign task if currently assigned,
 * and push back to available tasks pool.
 *
 * @param task :object
 * @returns {{type: string, task: *}}
 */
export function unassignTask(task) {
  return {
    type: unassignTask.ACTION_TYPE,
    task: task
  };
}
unassignTask.ACTION_TYPE = 'TASK_UNASSIGN';

/**
 * Assign task to worker if not assigned
 * or assigned to some other worker ;
 * otherwise, unassign task
 * and push back to available tasks pool.
 *
 * @param task :object
 * @param worker :object
 *   pass undefined to assign to currently selected worker
 * @returns {{type: string, task: *, worker: *}}
 */
export function toggleTaskAssignment(task, worker) {
  return {
    type: toggleTaskAssignment.ACTION_TYPE,
    task: task,
    worker: worker
  };
}
toggleTaskAssignment.ACTION_TYPE = 'TASK_TOGGLE_ASSIGN';

/**
 * Bulk assign groups to workers.
 *
 * @param groups
 *   :object (groupId => group of tasks)
 * @param workers
 *   :object (workerId => worker)
 * @param assignments
 *   :object (groupId => workerId: assigned executor)
 * @returns {{type: string, groups: *, workers: *, assignments: *}}
 */
export function setGroupAssignments(groups, workers, assignments) {
  return {
    type: setGroupAssignments.ACTION_TYPE,
    groups: groups,
    workers: workers,
    assignments: assignments
  };
}
setGroupAssignments.ACTION_TYPE = 'SET_GROUP_ASSIGNMENTS';
