import {Geometry} from './geometry';

export class Feature<T, G extends Geometry> {

  type: string = 'Feature';
  properties: T;
  geometry: G;

}

export class FeatureCollection {

  type: string = 'FeatureCollection';
  features: Array<Feature<any,any>>;

}
