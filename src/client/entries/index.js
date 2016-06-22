import React from 'react';
import ReactDOM from 'react-dom';
import {App} from '../app/app';
import {Provider} from 'react-redux';
import {reducer} from '../app/reducers/index';
import {loadProject, saveProject} from '../app/shared/project';
import URLSearchParams from 'url-search-params';
const Redux = require('redux');

class Messenger {

  message;

  getMessage() {
    return this.message;
  }

  setMessage(text, type) {
    this.message = {
      text: text,
      type: type
    };
  }

  clearMessages() {
    this.message = undefined;
  }

}

(function() {

  let store;
  let messenger = new Messenger();

  if (window.location.search) {
    let params = new URLSearchParams(window.location.search.slice(1));
    let projectId = params.get('p');
    if (projectId) {
      let state = loadProject(projectId);
      store = Redux.createStore(reducer, state);
      messenger.setMessage('Projet ouvert : ' + (state.project.title || 'Sans titre'), 'success');
    } else {
      store = Redux.createStore(reducer);
      messenger.setMessage('Nouveau projet', 'success');
    }
  } else {
    store = Redux.createStore(reducer);
    messenger.setMessage('Nouveau projet', 'success');
  }

  ReactDOM.render(
    <Provider store={ store }>
      <App messenger={ messenger }></App>
    </Provider>,
    document.getElementById('main')
  );

  window.onbeforeunload = function (e) {

    // TODO saveProject(store.getState());
    console.log(e);

    let message = "Voulez-vous vraiment quitter l'application ?";
    e = e || window.event;

    // For IE and Firefox
    if (e) {
      console.log(e);
      e.returnValue = message;
    }
    // For Safari
    return message;

  };

  store.dispatch({
    type: 'WORKER_RESET_FILTER'
  });
  store.dispatch({
    type: 'GROUP_RESET_FILTER'
  });

})();
