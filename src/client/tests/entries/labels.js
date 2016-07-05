import React from 'react';
import ReactDOM from 'react-dom';
import template from './labels.rt';
import fetch from 'isomorphic-fetch';
import {Provider} from 'react-redux';
import {listReducer} from '../../app/reducers/list.reducer';
import {createStore, combineReducers} from 'redux';

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return template.call(this);
  }

}

(function() {

  let reducer = combineReducers({
    'workers': listReducer('WORKER_'),
    'communes': listReducer('COMMUNE_')
  });
  let store = createStore(reducer);

  let app = ReactDOM.render(
    <Provider store={ store }>
      <App></App>
    </Provider>,
    document.getElementById('main')
  );

  console.log(app);

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

})();
