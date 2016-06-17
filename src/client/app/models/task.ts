import {Point, Feature} from './geojson';

export interface TaskProps {

  id: number;
  worker: string;
  label: string;
  group: string;

}

export class Task extends Feature<TaskProps, Point> {

  location(): Point {
    return this.geometry;
  }

}

export interface TaskGroupProps {

  tasks: Array<number>;
  worker: string;

}

export class TaskGroup extends Feature<TaskGroupProps, Point> {

  location(): Point {
    return this.geometry;
  }

}
