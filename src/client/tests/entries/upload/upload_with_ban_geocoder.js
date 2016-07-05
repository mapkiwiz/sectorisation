import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import * as Redux from 'redux';
import template from './upload.rt';
import {parseFile} from '../../../app/shared/components/upload/file.helper';
import {geocoder} from '../../../app/services/ban.postcode.geocoder';
import Promise from 'bluebird';

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

    console.log("CODE COMMUNE -> " + params.communeNameField);
    console.log("CODE POSTAL -> " + params.postcodeField);

    let communes = {};
    let counts = {};
    let requests = [];

    _.each(this.state.data, item => {
      let code = item[params.postcodeField];
      let city = item[params.communeNameField];
      if (code && city) {
        let key = code + ':' + city;
        if (!counts.hasOwnProperty(key)) {
          requests.push(geocoder(key, code, city).then(result => {
              if (result) {
                console.log(result);
                communes[result.key] = result.value;
              }
            })
          );
          counts[key] = 1;
        } else {
          counts[key] = counts[key] + 1;
        }
      }
    });

    console.log("Count of Items : " + this.state.data.length);
    console.log("Count of Communes : " + _.keys(counts).length);

    Promise.all(requests).then(() => {

      _.mapValues(communes, (value, key) => {
        if (value) {
          value.properties.count = counts[key];
          return value;
        }
      });

      console.log("Count of Resolved Communes : " +
        _.chain(communes).pickBy((value, key) => (value != null)).keys().value().length);

      this.setState({
        ...this.state,
        items: _.chain(communes).pickBy((value, key) => (value != null)).values().map(
          o => ({ id: o.properties.citycode, label: o.properties.citycode + ' ' + o.properties.label + ' (' + o.properties.count + ')' })
        ).sortBy(
          o => o.id
        ).value()
      });

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
