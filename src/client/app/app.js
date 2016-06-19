import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {MapContainer} from './map';
import {MenuPanel} from './panels/menu.panel';
import {WorkersListPanel} from './panels/workers.list.panel';
import {TaskGroupsListPanel} from './panels/taskgroups.list.panel';
import {TasksListPanel} from './panels/tasks.list.panel';
import {ProjectPanel} from './panels/project.panel';
import {ImportMenu} from './menus/import.menu';
import {TasksImportPanel} from './panels/tasks.import.panel';
import {WorkersImportPanel} from './panels/workers.import.panel';

function RootPanel(props, context) {
  return (
    <div className="container-fluid root-panel">
      <div className="row" style={{ width: '100%' }}>
          { props.children }
      </div>
    </div>
  );
}

export class App extends React.Component {

  static propTypes = {
    messenger: React.PropTypes.object
  };

  static childContextTypes = {
    messenger: React.PropTypes.object
  };

  getChildContext() {
    return {
      messenger: this.props.messenger
    };
  }

  render() {
    return (
      <div>
        <MapContainer></MapContainer>
        <Router history={ browserHistory } >
          <Route path="/" component={ RootPanel }>
            <IndexRoute component={ MenuPanel } />
            <Route path="/project" component={ ProjectPanel } />
            <Route path="/import">
              <IndexRoute component={ ImportMenu } />
              <Route path="/import/workers" component={ WorkersImportPanel } />
              <Route path="/import/tasks" component={ TasksImportPanel } />
            </Route>
            <Route path="/workers" component={ WorkersListPanel } />
            <Route path="/communes" component={ TaskGroupsListPanel } />
            <Route path="/tasks" component={ TasksListPanel } />
          </Route>
        </Router>
      </div>
    );
  }

}
