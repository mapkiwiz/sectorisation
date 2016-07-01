import URLSearchParams from 'url-search-params';
import fetch from 'isomorphic-fetch';
import {parse} from 'wellknown';
import concaveHull from 'concaveman';

export class GPPIsochroneService {

  url;
  options;

  constructor(options) {
    this.url = options.url;
    this.options = options;
  }

  fetch(feature, distance) {

    let lon = feature.geometry.coordinates[0],
      lat = feature.geometry.coordinates[1];
    let search = new URLSearchParams();
    search.set('location', [lon, lat].join(","));
    search.set('method', 'distance');
    search.set('holes', true);
    search.set('distance', distance);
    search.set('graphName', 'Voiture');
    search.set('smoothing', false);

    return fetch(this.url + '?' + search.toString(), {
      headers: {
        "Referer": this.options.referer
      }
    }).then(response => {
      if (response.status >= 400) throw new Error('Bad response');
      return response.json();
    }).then(result => {
      let polygon = parse(result.wktGeometry);
      return this.polygonToConcaveHull(polygon);
    });

  }

  polygonToConcaveHull(polygon) {
    return { type: 'Polygon', coordinates: [ concaveHull(polygon.coordinates[0], this.options.concavity) ] };
  }

}
