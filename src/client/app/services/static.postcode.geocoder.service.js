import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import parse from 'csv-parse';

export function geocoder(code) {
  return geocoder.refs[code];
};
geocoder.refs = {};
geocoder.ready = false;

function rowToGeoJSON(header, row) {
  let properties = _.zipObject(header, row);
  return {
    id: properties.CODE_POSTAL,
    geometry: { type: 'Point', coordinates: [ properties.LONGITUDE, properties.LATITUDE ] },
    properties: _.omit(properties, [ 'LONGITUDE', 'LATITUDE' ])
  };
}

fetch('data/postcodes.csv').then(response => {
  if (response.status >= 400) throw new Error('Bad response');
  return response.text();
}).then(data => {
  // Parse data as CSV with delimiter SEMICOLON
  parse(data, { delimiter: ';' }, (err, rows) => {
    // Skip header line
    let header = rows.shift();
    // Read rows
    _.each(rows, row => {
      let ref = rowToGeoJSON(header, row);
      geocoder.refs[ref.id] = ref;
    });
  });
}).then(() => {
  console.log('Geocoder data has loaded');
  geocoder.ready = true;
});
