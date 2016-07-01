import Promise from 'bluebird';
import Leaflet from 'leaflet';

const earthRadius = 6378137;

Promise.config({ cancellation: true });

export class MockIsochroneService {

  circle(center, radius, points) {

    let vertices = [];
    let c = Leaflet.Projection.SphericalMercator.project(
      Leaflet.latLng(
        center.coordinates[1],
        center.coordinates[0])
      ).multiplyBy(earthRadius);

    let stepAngle = Math.PI * 2 / points;
    for (var i=0; i<points; i++) {
      // let x = Math.cos(stepAngle) * (vertex[0] - center[0]) + Math.sin(stepAngle) * (vertex[1] - center[1]) + center[0]
      // let y = -Math.sin(stepAngle) * (vertex[0] - center[0]) + Math.cos(stepAngle) * (vertex[1] - center[1]) + center[1];
      let x = c.x + Math.cos(i*stepAngle)*radius;
      let y = c.y + Math.sin(i*stepAngle)*radius;
      let vertex = Leaflet.Projection.SphericalMercator.unproject(
        Leaflet.point(x,y).multiplyBy(1 / earthRadius));
      vertices.push([ vertex.lng, vertex.lat ]);
    }

    return vertices;

  }

  fetch(feature, distance) {

    return new Promise((resolve) => {
      setTimeout(() => {
        let result = {
          type: 'Polygon',
          coordinates: [ this.circle(feature.geometry, distance, 15) ]
        };
        resolve(result);
      }, Math.random() * 2000);
    });

  }

}
