import React from 'react';
import ReactDOM from 'react-dom';
import {App} from '../app/app';
import {Provider} from 'react-redux';
import {reducer} from './../app/reducers/index';
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

  let store = Redux.createStore(reducer);
  let messenger = new Messenger();
  messenger.setMessage('Bienvenue dans l\'application de sectorisation', 'success');

  ReactDOM.render(
    <Provider store={ store }>
      <App messenger={ messenger }></App>
    </Provider>,
    document.getElementById('main')
  );

})();
