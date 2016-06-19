import React from 'react';
import {Link} from 'react-router';
import {MessagePanel} from '../panels/message.panel';
import {MenuLink} from '../panels/menu.link';

export function ImportMenu(props, context) {

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Importer des données
        <MenuLink></MenuLink>
      </h3>
      <hr/>
      <MessagePanel></MessagePanel>
      <ul className="list">
        <li><Link to="/import/workers">Importer des enquêteurs</Link></li>
        <li><Link to="/import/tasks">Importer des unités statistiques</Link></li>
      </ul>
    </div>
  );

}
