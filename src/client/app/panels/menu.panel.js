import React from 'react';
import {Link} from 'react-router';
import {MessagePanel} from './message.panel';

export function MenuPanel(props, context) {

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>Menu principal</h3>
      <hr/>
      <MessagePanel></MessagePanel>
      <ul className="list">
        <li><Link to="/import/workers">Importer des enquêteurs</Link></li>
        <li><Link to="/import/tasks">Importer des unités statistiques</Link></li>
      </ul>
    </div>
  );
  
}
