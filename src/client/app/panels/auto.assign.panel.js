import React from 'react';
import {MenuLink} from './menu.link';
import {MessagePanel} from './message.panel';
import {AutoAssignService} from '../services/auto.assign.heap.service';
import {setGroupAssignments} from '../actions/assignments';

function listToObjectIndex(list) {
  return list.reduce((acc, currentValue) => {
    acc[currentValue.id] = currentValue;
    return acc;
  }, {});
}

export function AutoAssignPanel(props, context) {

  let service = new AutoAssignService(
    context.store.getState().project.defaults['worker.capacity'],
    worker => {
      return context.store.getState().isochrones.items[worker.id];
    });

  let workers = context.store.getState().workers.items;
  let groups = context.store.getState().groups.items;
  let initialAssignments = context.store.getState().assignments.tasks;
  let assignments = service.assign(workers, groups, initialAssignments);

  console.log(assignments);
  context.store.dispatch(setGroupAssignments(listToObjectIndex(groups), listToObjectIndex(workers), assignments));
  context.messenger.setMessage('Affectation automatique terminée', 'success');

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Affectation automatique
        <MenuLink />
      </h3>
      <hr/>
      <MessagePanel />
    </div>
  );
}

AutoAssignPanel.contextTypes = {
  store: React.PropTypes.object,
  messenger: React.PropTypes.object
}
