import React from 'react';
import {Link} from 'react-router';
import {MessagePanel} from '../panels/message.panel';
import {MenuLink} from '../panels/menu.link';

export function AssignmentMenu(props, context) {

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Outils d'affectation
        <MenuLink></MenuLink>
      </h3>
      <hr/>
      <MessagePanel></MessagePanel>
      <ul className="list">
        <li><Link to="/assign/isochrones">Calcul des isochrones</Link></li>
        <li><Link to="/assign/auto">Affectation automatique</Link></li>
        <li><Link to="/assign/dashboard">Tableau de bord</Link></li>
      </ul>
    </div>
  );

}
