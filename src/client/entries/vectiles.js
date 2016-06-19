import React from 'react';
import ReactDOM from 'react-dom';
import template from './vectiles.rt';

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return template.call(this);
  }

}

(function() {

  ReactDOM.render(
    <App></App>,
    document.getElementById('main')
  );

})();
