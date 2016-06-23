import React from 'react';
import {MenuLink} from './menu.link';
import {Link} from 'react-router';

let worker_classes = [
  {
    label: 'Enquêteur sélectionné',
    className: 'glyphicon glyphicon-map-marker worker-selected'
  },
  {
    label: 'Enquêteur sans US',
    className: 'glyphicon glyphicon-map-marker worker-untasked'
  },
  {
    label: 'Enquêteur, charge d\'US < 50% capacité',
    className: 'glyphicon glyphicon-map-marker worker-low-tasked'
  },
  {
    label: 'Enquêteur, charge d\'US < 80 % capacité',
    className: 'glyphicon glyphicon-map-marker worker-medium-tasked'
  },
  {
    label: 'Enquêteur à capacité',
    className: 'glyphicon glyphicon-map-marker worker-fully-tasked'
  },
  {
    label: 'Enquêteur avec trop d\'US',
    className: 'glyphicon glyphicon-map-marker worker-over-tasked'
  },
  {
    label: 'Enquêteur inactif',
    className: 'glyphicon glyphicon-map-marker worker-inactive'
  },
];

let group_classes = [
  {
    label: 'Groupe sélectionné',
    className: 'taskgroup-assigned-selected'
  },
  {
    label: 'Groupe partiellement affecté',
    className: 'taskgroup-partially-assigned'
  },
  {
    label: 'Groupe non affecté',
    className: 'taskgroup-unassigned'
  },
  {
    label: 'Groupe affecté à un autre enquêteur',
    className: 'taskgroup-assigned'
  }
];

export function ClassLegend(props, context) {

  return (
    <div className="panel panel-info">
      <div className="panel-heading">
        <h4 className="panel-title">
          { props.title }
          <Link to={ props.next } className="pull-right">
            <span className="glyphicon glyphicon-chevron-right"></span>
          </Link>
        </h4>
      </div>
      <div className="panel-body">
        <ul className="list legend">
          { props.items }
        </ul>
      </div>
    </div>
  );

}

export function WorkerLegend(props, context) {

  let items = worker_classes.map(item => {
    return (
      <li>
        <span className={ 'legend-icon ' + item.className }></span>
        <div className="legend-label">{ item.label }</div>
      </li>
    );
  });

  return (
    <ClassLegend title="Enquêteurs"
                 items={ items }
                 next="/legend/groups" />
  );
}

export function GroupLegend(props, context) {

  let items = group_classes.map(item => {
    return (
      <li>
        <div className={ 'legend-icon ' + item.className }>
          <span className="badge">8</span>
        </div>
        <div className="legend-label">{ item.label }</div>
      </li>
    );
  });

  return (
    <ClassLegend title="Groupes d'unités statistiques"
                 items={ items }
                 next="/legend/workers" />
  );
}

export function Legends(props, context) {
  return (
    <ul className="list">
      <li><Link to="/legend/workers">Enquêteurs</Link></li>
      <li><Link to="/legend/groups">Groupes d'unités statistiques</Link></li>
    </ul>
  );
}

export function LegendPanel(props, context) {

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Légende
        <MenuLink />
      </h3>
      <hr/>
      { props.children }
    </div>
  );

}
