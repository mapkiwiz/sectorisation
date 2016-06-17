import {Point, Feature} from './geojson';

export interface WorkerProps {

  id: number;
  label: string;
  capacity: number;
  tasks: Array<number>;

}

export class Worker extends Feature<WorkerProps, Point> {

  location(): Point {
    return this.geometry;
  }

}
