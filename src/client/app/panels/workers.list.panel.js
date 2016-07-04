import React from 'react';
import {Link} from 'react-router';
import {MenuLink} from './menu.link';
import {List} from '../shared/components/list/list.component';
import {SearchBox} from '../shared/components/list/searchbox.component';

function mapStateToWorkers(state) {
  return {
    items: state.workers.visible_items,
    selected: state.workers.selected,
    scrollIndex: state.workers.scrollIndex };
}

function renderWorkerItem(item, context) {
  let assignments = context.store.getState().assignments.workers[item.id] || 0;
  return (
    <div>
      <span className="badge">{ assignments }</span>
      <span style={{ marginLeft: '10px', verticalAlign: 'middle' }}>{ item.label }</span>
      <div className="pull-right">
        <Link to={`/worker/${item.id}/details`} onClick={e => e.stopPropagation() }>
          <span className="glyphicon glyphicon-chevron-right"></span>
        </Link>
      </div>
    </div>
  );
}

function filterByLabel(term, context) {
  context.store.dispatch({
    type: 'WORKER_FILTER',
    filter: item => {
      return item.label.toLowerCase().contains(term.toLowerCase());
    }
  });
}

export function WorkersListPanel(props, context) {

  let workers = context.store.getState().workers;

  if (workers.items.length == 0) {
    return (
      <div className="col-md-4 col-md-offset-8 panel-container">
        <h3>
          Enquêteurs
          <MenuLink />
        </h3>
        <hr/>
        <div className="alert alert-info">
          Aucun enquêteur
          <Link to="/import/workers" className="pull-right">Importer</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Enquêteurs
        <MenuLink />
      </h3>
      <hr/>
      <SearchBox search={ term => filterByLabel(term, context) } />
      <List items={ workers.visible_items }
            renderItem={ item => renderWorkerItem(item, context) }
            actionPrefix="WORKER_"
            mapState={ mapStateToWorkers }>
      </List>
    </div>
  );
}

WorkersListPanel.contextTypes = {
  store: React.PropTypes.object
};
