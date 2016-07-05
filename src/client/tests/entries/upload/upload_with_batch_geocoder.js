import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import * as Redux from 'redux';
import template from './upload.rt';
import {parseFile, parseAsObject} from '../../../app/shared/components/upload/file.helper';
import superagent from 'superagent';

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
      items: this.mapContextToState(),
      file: undefined,
      headers: undefined,
      data: undefined
    };
  },

  mapContextToState: function() {
    return this.context.store.getState().items;
  },

  onDrop: function(file, data) {
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
  },

  accept: function(params) {

    console.log("CODE POSTAL -> " + params.postcodeField);
    console.log("COMMUNE -> " + params.communeNameField);

    /* Counting by locality (postcode/commune) */
    let counts = { 'missing': 0 };
    _.each(this.state.data, item => {

      let code = item[params.postcodeField];
      let city = item[params.communeNameField];
      if (code && city) {
        let key = code + ':' + city;
        if (!counts.hasOwnProperty(key)) {
          counts[key] = 1;
        } else {
          counts[key] += 1;
        }
      } else {
        counts['missing'] += 1;
      }

    });

    console.log("Count of Items : " + this.state.data.length);
    console.log("Count of Localities : " + (_.keys(counts).length - 1));
    console.log("Missing Localities : " + counts.missing);

    /* geocode using BAN API */
    let formData = new FormData();
    formData.append('data', this.state.file);
    formData.append('postcode', params.postcodeField);
    formData.append('columns', params.communeNameField);
    superagent.post('http://api.adresse.data.gouv.fr/search/csv').send(formData).end((err, response) => {
      if (!err) {
        parseAsObject(response.text, { comment: '#', delimiter: ';' }, results => {
          let items = [];
          let communes = {};
          _.each(results, result => {
            let code = result[params.postcodeField];
            let city = result[params.communeNameField];
            let key = code + ':' + city;
            let citycode = result['result_citycode'];
            if (!communes.hasOwnProperty(citycode)) {
              communes[citycode] = {
                type: 'Feature',
                id: result['result_citycode'],
                label: result['result_label'] + ' (' + counts[key] + ')',
                properties: {
                  citycode: result['result_citycode'],
                  postcode: result['result_postcode'],
                  city: result['result_city'],
                  score: result['result_score'],
                  count: counts[key]
                },
                geometry: {
                  type: 'Point',
                  coordinates: [ result.lon, result.lat ]
                }
              };
            }
            items.push({
              id: result[params.idField],
              label: result[params.labelField],
              commune: result['result_label'],
              citycode: result['result_citycode']
            });
          });
          /* set items and communes */
          console.log("Count of Resolved Postcodes : " + _.keys(communes).length);
          this.setState({
            ...this.state,
            items: _.values(communes)
          });
        });
      }
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
