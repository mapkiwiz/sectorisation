import React from 'react';
import {MenuLink} from './menu.link';

export function WorkerDetailsPanel(props, context) {
  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Détail de l'enquêteur
        <MenuLink to="/workers" />
      </h3>
      <hr/>
      <p className="help-block">Pas encore implémenté</p>
    </div>
  );
}
