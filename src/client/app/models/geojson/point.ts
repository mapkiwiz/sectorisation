import {Geometry} from './geometry';

export class Point implements Geometry {

  type: 'Point';
  coordinates: Array<number>;

  constructor(x: number, y: number) {
    this.coordinates = [ x, y ];
  }

  x(): number {
    return this.coordinates[0];
  }

  y(): number {
    return this.coordinates[1];
  }

}
