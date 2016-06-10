import _ from 'lodash';
import fetchJsonp from 'fetch-jsonp';
import URLSearchParams from 'url-search-params';
import {parse} from 'wellknown';
import concaveHull from 'concaveman';

const gpp_key = "50bejnu55v5ievgkbvzxas6s";
const gpp_isochrone_url = "https://wxs.ign.fr/" + gpp_key + "/isochrone/isochrone.json";
const gpp_referer = "http://geo.agriculture/affectation-demo";
const distance = 20000;
const concavity = 2;

export class IsochroneUpdater {

  store;
  dispose;
  dispatching = false;
  selection;

  constructor(store) {
    this.store = store;
    this.dispose = store.subscribe(() => {
      let selection = _.first(this.store.getState().workers.selected);
      if (selection != this.selection) {
        this.selection = selection;
        this.selectIsochrone(this.findFeature(this.selection), distance);
      }
    });
  }

  doAction(action) {
    this.store.dispatch(action);
  }

  findFeature(key) {
    if (!key) return undefined;
    let features = this.store.getState().workers.items;
    return _.find(features, o => ( o.id == key ));
  }

  selectIsochrone(feature, distance) {

    if (!this.dispatching) {

      this.dispatching = true;

      if (!feature) {
        this.doAction({type: 'ISOCHRONE_UNSELECT'});
        return;
      }

      let isochrones = this.store.getState().isochrones.items;
      if (_.has(isochrones, feature.id)) {
        this.doAction({type: 'ISOCHRONE_SELECT', key: feature.id});
      } else {
        this.fetchIsochrone(feature, distance, (result) => {
          this.doAction({type: 'ISOCHRONE_STORE', key: feature.id, payload: result});
          this.doAction({type: 'ISOCHRONE_SELECT', key: feature.id});
        });
      }

      this.dispatching = false;

    }

  }

  fetchIsochrone(feature, distance, callback) {

    let lon = feature.geometry.coordinates[0],
      lat = feature.geometry.coordinates[1];
    let search = new URLSearchParams();
    search.set('location', [lon, lat].join(","));
    search.set('method', 'distance');
    search.set('holes', true);
    search.set('distance', distance);
    search.set('graphName', 'Voiture');
    search.set('smooth', true);

    fetchJsonp(gpp_isochrone_url + '?' + search.toString(), {
      headers: {
        "Referer": gpp_referer
      }
    }).then(response => {
      if (response.status >= 400) throw new Error('Bad response');
      return response.json();
    }).then(result => {
      let polygon = parse(result.wktGeometry);
      callback(this.polygonToConcaveHull(polygon));
    });

  }

  polygonToConcaveHull(polygon) {
    return { type: 'Polygon', coordinates: [ concaveHull(polygon.coordinates[0], concavity) ] };
  }

}
