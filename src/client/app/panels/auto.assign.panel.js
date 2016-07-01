import React from 'react';
import {MenuLink} from './menu.link';
import {MessagePanel} from './message.panel';
import {AutoAssignService} from '../services/auto.assign.service';

export function AutoAssignPanel(props, context) {

  let service = new AutoAssignService(context.store);
  let workers = context.store.getState().workers.items;
  let groups = context.store.getState().groups.items;
  let assignments = service.assign();

  assignments.map((assignment, index) => {
    if (assignment !== undefined) {
      context.store.dispatch({
        type: 'WORKER_SELECT_ONE',
        id: workers[assignment].id
      });
      context.store.dispatch({
        type: 'GROUP_ASSIGN',
        group: groups[index],
        tasks: groups[index].tasks
      });
    } else {
      context.store.dispatch({
        type: 'WORKER_UNSELECT'
      });
      context.store.dispatch({
        type: 'GROUP_UNASSIGN',
        group: groups[index],
        tasks: groups[index].tasks,
      });
    }
  });

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
