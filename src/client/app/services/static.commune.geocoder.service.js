import _ from 'lodash';
import fetch from 'isomorphic-fetch';

export function geocoder(code) {
  return geocoder.refs[code];
};
geocoder.refs = {};
geocoder.ready = false;

fetch('data/communes_fla_p.geojson').then(response => {
  if (response.status >= 400) throw new Error('Bad response');
  return response.json();
}).then(data => {
  _.each(data.features, ref => {
    ref.id = ref.properties.INSEE_COM;
    geocoder.refs[ref.id] = ref;
  });
}).then(() => {
  console.log('Geocoder data has loaded');
  geocoder.ready = true;
});
