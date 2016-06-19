import React from 'react';
// import {Link} from 'react-router';
import {MenuLink} from './menu.link';
import {List} from '../shared/components/list/list.component';
import {SearchBox} from '../shared/components/list/searchbox.component';

function mapStateToWorkers(state) {
  return {
    items: state.workers.visible_items,
    selected: state.workers.selected,
    scrollIndex: state.workers.scrollIndex };
}

function renderWorkerItem(item) {
  return item.label;
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

  let workers = context.store.getState().workers.visible_items;

  return (
    <div className="col-md-4 col-md-offset-8 panel-container">
      <h3>
        Enquêteurs
        <MenuLink />
      </h3>
      <hr/>
      <SearchBox search={ term => filterByLabel(term, context) } />
      <List items={ workers }
            renderItem={ renderWorkerItem }
            actionPrefix="WORKER_"
            mapState={ mapStateToWorkers }>
      </List>
    </div>
  );
}

WorkersListPanel.contextTypes = {
  store: React.PropTypes.object
};
