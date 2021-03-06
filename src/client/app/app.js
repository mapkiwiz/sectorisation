import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {MapContainer} from './map';
import {MenuPanel} from './panels/menu.panel';
import {WorkersListPanel} from './panels/workers.list.panel';
import {WorkerDetailsPanel} from './panels/worker.details.panel';
import {TaskGroupsListPanel} from './panels/taskgroups.list.panel';
import {TasksListPanel} from './panels/tasks.list.panel';
import {ImportMenu} from './menus/import.menu';
import {TasksImportPanel} from './panels/tasks.import.panel';
import {WorkersImportPanel} from './panels/workers.import.panel';
import {LayerSwitcherPanel} from './panels/layerswitcher.panel';
import {ProjectMenu} from './menus/project.menu';
import {ProjectOpenPanel} from './panels/project.open.panel';
import {ProjectPropertiesPanel} from './panels/project.properties.panel';
import {ProjectImportPanel} from './panels/project.import.panel';
import {ExportQGisPanel} from './panels/export.qgis.panel';
import {LegendPanel, WorkerLegend, GroupLegend, Legends} from './panels/legend.panel';
import {IsochroneLoadingPanel} from './panels/isochrone.loading.panel';
import {AssignmentMenu} from './menus/assignment.menu';
import {AutoAssignPanel} from './panels/auto.assign.panel';
import {AssignDashboardPanel} from './panels/assign.dashboard.panel';

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
        <MapContainer />
        <Router history={ browserHistory } >
          <Route path="/" component={ RootPanel }>
            <IndexRoute component={ MenuPanel } />
            <Route path="/project" >
              <IndexRoute component={ ProjectMenu } />
              <Route path="/project/open" component={ ProjectOpenPanel } />
              <Route path="/project/export/qgis" component={ ExportQGisPanel } />
              <Route path="/project/properties" component={ ProjectPropertiesPanel } />
              <Route path="/project/import" component={ ProjectImportPanel } />
            </Route>
            <Route path="/import">
              <IndexRoute component={ ImportMenu } />
              <Route path="/import/workers" component={ WorkersImportPanel } />
              <Route path="/import/tasks" component={ TasksImportPanel } />
            </Route>
            <Route path="/assign">
              <IndexRoute component={ AssignmentMenu } />
              <Route path="/assign/isochrones" component={ IsochroneLoadingPanel } />
              <Route path="/assign/auto" component={ AutoAssignPanel } />
              <Route path="/assign/dashboard" component={ AssignDashboardPanel } />
            </Route>
            <Route path="/workers" component={ WorkersListPanel } />
            <Route path="/worker/:id/details" component={ WorkerDetailsPanel } />
            <Route path="/communes" component={ TaskGroupsListPanel } />
            <Route path="/tasks" component={ TasksListPanel } />
            <Route path="/baselayers" component={ LayerSwitcherPanel } />
            <Route path="/legend" component={ LegendPanel } >
              <IndexRoute component={ Legends } />
              <Route path="/legend/workers" component={ WorkerLegend } />
              <Route path="/legend/groups" component={ GroupLegend } />
            </Route>
          </Route>
        </Router>
      </div>
    );
  }

}
