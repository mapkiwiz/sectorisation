import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import * as Redux from 'redux';
import template from './upload.rt';
import {parseFile} from '../app/shared/components/upload/file.helper';
import _ from 'lodash';

let initialState = {
  items: [ { id: 1, label: 'toto' } ],
  selected: [],
  scrollIndex: undefined
};

let reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export class App extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      items: this.mapContextToState(),
      file: undefined,
      headers: undefined,
      data: undefined
    };
  }

  mapContextToState() {
    return this.context.store.getState().items;
  }

  onDrop(file, data) {
    parseFile(file, data, o => {
      if (_.isArray(o)) {
        let headers = _.keys(_.first(o));
        this.setState({
          items: this.mapContextToState(),
          file: file,
          data: o,
          headers: headers
        });
      } else if (_.isObject(o)) {
        if (o.type && o.type == 'FeatureCollection') {
          console.log('GeoJSON');
        } else {
          console.log('JSON');
        }
      }
    });
  }

  accept(e) {

    e.preventDefault();
    let label = e.target['label_field'].value;
    console.log(label);

    this.setState({
      ...this.state,
      items: this.state.data.map((item,id) => {
        item.id = id;
        item.label = item[label];
        return item;
      })
    });

  }

  render() {
    return template.call(this);
  }

}

(function() {

  let store = Redux.createStore(reducer);

  ReactDOM.render(
    <Provider store={ store }>
      <App></App>
    </Provider>,
    document.getElementById('main')
  );

})();
