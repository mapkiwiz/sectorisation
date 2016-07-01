import React from 'react';
import {Link} from 'react-router';
import {MessagePanel} from './message.panel';

export function MenuPanel(props, context) {

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>Outil de sectorisation</h3>
      <hr/>
      <MessagePanel></MessagePanel>
      <ul className="list">
        <li><Link to="/project">Projet</Link></li>
        <li><Link to="/workers">Enquêteurs</Link></li>
        <li><Link to="/tasks">Unités statistiques</Link></li>
        <li><Link to="/import">Importer des données</Link></li>
        <li><Link to="/assign">Outils d'affectation</Link></li>
        <li><Link to="/baselayers">Fonds de plan</Link></li>
        <li><Link to="/legend">Légende</Link></li>
      </ul>
    </div>
  );

}
