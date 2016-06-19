import React from 'react';
import {MenuLink} from './menu.link';
import {Link} from 'react-router';

export function TasksListPanel(props, context) {

  let tasks = context.store.getState().tasks;

  if (tasks.items.length == 0) {
    return (
      <div className="col-md-4 col-md-offset-8 panel-container">
        <h3>
          Unités statistiques
          <MenuLink />
        </h3>
        <hr/>
        <div className="alert alert-info">
          Aucune unité statistique
          <Link to="/import/tasks" className="pull-right">Importer</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Unités statistiques
        <MenuLink />
      </h3>
      <hr/>
      <p className="help-block">Pas encore implémenté</p>
    </div>
  );

}

TasksListPanel.contextTypes = {
  store: React.PropTypes.object
};
