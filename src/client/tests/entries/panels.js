import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import {List} from '../../app/shared/components/list/list.component';
import {SearchBox} from '../../app/shared/components/list/searchbox.component';
import fetch from 'isomorphic-fetch';
import {Provider} from 'react-redux';
import {listReducer} from '../../app/reducers/list.reducer';
import {createStore, combineReducers} from 'redux';
import _ from 'lodash';

class Menu extends React.Component {

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <h1>Panels</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-md-offset-1">
            <h3>Index</h3>
            <hr/>
            <ul className="list">
              <li><Link to="/panels.html">Home</Link></li>
              <li><Link to="/panels.html/workers">Enquêteurs</Link></li>
              <li><Link to="/panels.html/communes">Communes</Link></li>
              <li><Link to="/panels.html/tasks">Unités statistiques</Link></li>
            </ul>
          </div>
          <div className="col-md-7">
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }

}

class Workers extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.filterByLabel = _.debounce(this.filterByLabel, 200);
    this.context.store.dispatch({
      type: 'WORKER_RESET_FILTER'
    });
    this.state = this.mapContextToState();
  }

  mapContextToState() {
    return {
      items: this.context.store.getState().workers.visible_items
    };
  }

  filterByLabel(term) {
    this.context.store.dispatch({
      type: 'WORKER_FILTER',
      filter: item => {
        return item.label.toLowerCase().contains(term.toLowerCase());
      }
    });
    this.setState(this.mapContextToState());
  }

  render() {
    return (
      <div>
        <h3>Enquêteurs</h3>
        <hr/>
        <SearchBox search={ (term) => this.filterByLabel(term) }></SearchBox>
        <List items={ this.state.items }
              renderItem={ (item) => item.label }
              actionPrefix="WORKER_"
              mapState={ state => ({ items: state.workers.items, selected: state.workers.selected, scrollIndex: state.workers.scrollIndex }) }>
        </List>
      </div>
    );
  }

}

class Communes extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.filterByLabel = _.debounce(this.filterByLabel, 200);
    this.context.store.dispatch({
      type: 'COMMUNE_RESET_FILTER'
    });
    this.state = this.mapContextToState();
  }

  mapContextToState() {
    return {
      items: this.context.store.getState().communes.visible_items
    };
  }

  filterByLabel(term) {
    this.context.store.dispatch({
      type: 'COMMUNE_FILTER',
      filter: item => {
        return item.label.toLowerCase().contains(term.toLowerCase());
      }
    });
    this.setState(this.mapContextToState());
  }

  render() {
    return (
      <div>
        <h3>Communes</h3>
        <hr/>
        <SearchBox search={ (term) => this.filterByLabel(term) }></SearchBox>
        <List items={ this.state.items }
              renderItem={ (item) => item.label }
              actionPrefix="WORKER_"
              mapState={ state => ({ items: state.communes.items, selected: state.communes.selected, scrollIndex: state.communes.scrollIndex }) }>
        </List>
      </div>
    );
  }

}

class Tasks extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object
  };

  render() {
    return (
      <List items={ this.context.store.getState().tasks.visible_items }
            renderItem={ (item) => item.label }
            actionPrefix="TASK_"
            mapState={ state => ({ items: state.tasks.items, selected: state.tasks.selected, scrollIndex: state.tasks.scrollIndex }) }>
      </List>
    );
  }

}

function Home(props, context) {

  return (
    <div>
      <h3>Hello, World !</h3>
      <hr/>
      <p className="help-block">Pick a category in the index menu</p>
    </div>
  );

}

(function() {

  let reducer = combineReducers({
    'workers': listReducer('WORKER_'),
    'communes': listReducer('COMMUNE_'),
    'tasks': listReducer('TASK_')
  });

  let store = createStore(reducer);

  ReactDOM.render(
    <Provider store={ store }>
      <Router history={ browserHistory } >
        <Route path="/panels.html" component={ Menu }>
          <IndexRoute component={ Home } />
          <Route path="/panels.html/workers" component={ Workers } />
          <Route path="/panels.html/communes" component={ Communes } />
          <Route path="/panels.html/tasks" component={ Tasks } />
        </Route>
      </Router>
    </Provider>,
    document.getElementById('main')
  );

  fetch('data/enqueteurs.geojson').then(response => {
    if (response.status >= 400) throw new Error('Bad response');
    return response.json();
  }).then(data => {
    data.features.forEach(f => {
      f.label = f.properties.prenom + ' ' + f.properties.nom;
      f.id = f.properties.gid;
    });
    store.dispatch({
      type: 'WORKER_SET_ITEMS',
      items: data.features
    })
  });

  fetch('data/communes_centroid.geojson').then(response => {
    if (response.status >= 400) throw new Error('Bad response');
    return response.json();
  }).then(data => {
    data.features.forEach(f => {
      f.label = f.properties.NOM;
      f.id = f.properties.CODE_INSEE;
    });
    store.dispatch({
      type: 'COMMUNE_SET_ITEMS',
      items: data.features
    })
  });

  fetch('data/us.geojson').then(response => {
    if (response.status >= 400) throw new Error('Bad response');
    return response.json();
  }).then(data => {
    data.features.forEach(f => {
      f.label = 'US #' + f.properties.gid;
      f.id = f.properties.gid;
    });
    store.dispatch({
      type: 'TASK_SET_ITEMS',
      items: data.features
    })
  });

})();
