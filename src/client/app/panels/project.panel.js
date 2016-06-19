import React from 'react';
import {MenuLink} from './menu.link';

export function ProjectPanel(props, context) {
  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Propriétés du projet
        <MenuLink />
      </h3>
      <hr/>
      <p className="help-block">Pas encore implémenté</p>
    </div>
  );
}
