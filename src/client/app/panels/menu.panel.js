import React from 'react';
import {Link} from 'react-router';

export function MenuPanel(props, context) {
  return (
    <div>
      <h3>Menu principal</h3>
      <hr/>
      <ul className="list">
        <li><Link to="/import/workers">Importer des enquêteurs</Link></li>
        <li><Link to="/import/tasks">Importer des unités statistiques</Link></li>
      </ul>
    </div>
  );
}
