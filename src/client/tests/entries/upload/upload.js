import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import * as Redux from 'redux';
import template from './upload.rt';
import {parseFile} from '../../../app/shared/components/upload/file.helper';
import {geocoder} from '../../../app/services/static.postcode.geocoder.service';

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

let App = React.createClass({

  mixins: [ React.LinkedStateMixin ],

  contextTypes: {
    store: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      items: [],
      file: undefined,
      headers: undefined,
      data: undefined
    };
  },

  onDrop: function(file, data) {
    this.setState({
      items: [],
      file: undefined,
      headers: undefined,
      data: undefined
    });
    parseFile(file, data, o => {
      if (_.isArray(o)) {
        let headers = _.keys(_.first(o));
        this.setState({
          items: [],
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
  },

  accept: function(params) {

    console.log("CODE POSTAL -> " + params.postcodeField);
    let postcodes = {};
    let counts = {};

    _.each(this.state.data, item => {
      let code = item[params.postcodeField];
      if (code) {
        if (!postcodes.hasOwnProperty(code)) {
          let commune = geocoder(code);
          postcodes[code] = commune || null;
        }
        if (!counts.hasOwnProperty(code)) {
          counts[code] = 1;
        } else {
          counts[code] += 1;
        }
      }
    });

    _.mapValues(postcodes, (value, key) => {
      if (value) {
        value.properties.count = counts[key];
        return value;
      }
    });

    console.log("Count of Items : " + this.state.data.length);
    console.log("Count of Postcodes : " + _.keys(counts).length);
    console.log("Count of Resolved Postcodes : " +
      _.chain(postcodes)
        .pickBy((value, key) => (value != null))
        .keys()
        .value().length);
    console.log(_.chain(postcodes)
      .pickBy(value => value == null)
      .keys()
      .value());

    this.setState({
      ...this.state,
      items: _.chain(postcodes).pickBy((value, key) => (value != null)).values().map(
        o => ({ id: o.id, label: o.id + ' ' + o.properties.COMMUNE + ' (' + o.properties.count + ')' })
      ).sortBy(
        o => o.id
      ).value()
    });

  },

  render: function() {
    return template.call(this);
  }

});

(function() {

  let store = Redux.createStore(reducer);


  ReactDOM.render(
    <Provider store={ store }>
      <App></App>
    </Provider>,
    document.getElementById('main')
  );

})();
