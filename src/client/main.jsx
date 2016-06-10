import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {reducer} from './app/reducers/index';
import {App} from './app';
import fetch from 'isomorphic-fetch';
const Redux = require('redux');

// let select = (state = {}, action) => {
//   switch (action.type) {
//     case 'SELECT':
//       return Object.assign({}, state, { [action.id]: { selected: true }});
//     case 'SELECT_ONE':
//       let selected = {};
//       for (var key in state) {
//         if (state.hasOwnProperty(key)) {
//           selected[key] = { selected: (key === action.id) };
//         }
//       }
//       return selected;
//     case 'UNSELECT':
//       return Object.assign({}, state, { [action.id]: { selected: false }});
//     default:
//       return state;
//   }
// };
//
// let reducer = Redux.combineReducers({ selected: select });

(function() {

  let store = Redux.createStore(reducer);

  ReactDOM.render(
    <Provider store={ store }><App title="Hello World"></App></Provider>,
    document.getElementById("main")
  );

  store.dispatch({
    type: 'SET_LIST_TITLE',
    title: 'This is a new  list title'
  });

  // fetch('items.json').then(response => {
  //   if (response.status >= 400) throw new Error('Bad response');
  //   return response.json();
  // }).then(data => {
  //   store.dispatch({
  //     type: 'SET_ITEMS',
  //     items: data.items
  //   });
  //   store.dispatch({
  //     type: 'SCROLL_TO',
  //     index: Math.floor(data.items.length / 2)
  //   });
  // });

  fetch('data/enqueteurs.geojson').then(response => {
    if (response.status >= 400) throw new Error('Bad response');
    return response.json();
  }).then(data => {
    data.features.forEach(f => {
      f.label = f.properties.prenom + ' ' + f.properties.nom;
      f.id = f.properties.gid;
    });
    store.dispatch({
      type: 'SET_ITEMS',
      items: data.features
    })
  });

})();
