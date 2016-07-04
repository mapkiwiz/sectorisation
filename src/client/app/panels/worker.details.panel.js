import React from 'react';
import {MenuLink} from './menu.link';
import _ from 'lodash';

export function WorkerDetailsPanel(props, context) {

  let path = window.location.toString().match(/\/worker\/(\d+)\/details$/);
  let workerId = +path[1];
  let worker = _.find(context.store.getState().workers.items, o => (o.id == workerId));
  let properties = _.chain(worker.properties).omit([
      'active',
      'capacity'
    ]).flatMap((value, key) => {
      return (
        <tr key={ key }>
          <td>{ key }</td>
          <td>{ value }</td>
        </tr>
      );
  }).value();

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Détail de l'enquêteur
        <MenuLink to="/workers" />
      </h3>
      <hr/>
      <h4>
        { worker.label }
        <span className="pull-right" style={{ 'color': 'lightgrey' }}># {workerId}</span>
      </h4>
      <table className="table table-striped table-bordered">
        <tbody>
          { properties }
        </tbody>
      </table>
    </div>
  );
}

WorkerDetailsPanel.contextTypes = {
  store: React.PropTypes.object
};
