import {pointInPolygon} from '../../lib/geometry/pointInPolygon';
import Leaflet from 'leaflet';
import Heap from 'heap';

export class AutoAssignService {

  defaultCapacity;
  maxIteration;
  workerLoads;
  isochrone;

  constructor(defaultCapacity, isochrone) {

    this.defaultCapacity = defaultCapacity;
    this.maxIteration = 20;
    this.workerLoads = {};
    this.isochrone = isochrone;

  }

  distance(a, b) {

    // let aLatLng = Leaflet.latLng(a.coordinates[1], a.coordinates[0]);
    // let bLatLng = Leaflet.latLng(b.coordinates[1], b.coordinates[0]);
    // return aLatLng.distanceTo(bLatLng);
     var ax = a.coordinates[0], ay = a.coordinates[1],
         bx = b.coordinates[0], by = b.coordinates[1];
    return Math.sqrt(Math.pow(ax - bx, 2) + Math.pow(ay - by, 2));

  }

  costMatrix(workers, tasks) {

    return workers.map(worker => {

      var capacity = this.leftCapacity(worker);
      let accessiblePolygon = this.isochrone(worker);

      return tasks.map(task => {

        let distance = Infinity;
        if (accessiblePolygon) {
          if (pointInPolygon(task.geometry, accessiblePolygon)) {
            distance = this.distance(worker.geometry, task.geometry);
          }
        } else {
          distance = this.distance(worker.geometry, task.geometry);
        }

        let cost = this.assignmentCost(distance, capacity);
        return cost;

      });

    });

  }

  costHeap(workers, tasks) {

    let heap = new Heap((a,b) => {
      return a.cost - b.cost;
    });

    workers.forEach(worker => {

      var capacity = this.leftCapacity(worker);
      let accessiblePolygon = this.isochrone(worker);

      tasks.forEach(task => {

        let distance = Infinity;
        if (accessiblePolygon) {
          if (pointInPolygon(task.geometry, accessiblePolygon)) {
            distance = this.distance(worker.geometry, task.geometry);
          }
        } else {
          distance = this.distance(worker.geometry, task.geometry);
        }

        let cost = this.assignmentCost(distance, capacity);
        heap.push({
          worker: worker,
          task: task,
          cost: cost
        });

      });

    });

    return heap;

  }

  assignmentCost(distance, capacity) {

    return Math.pow(distance, 2) / capacity;

  }

  leftCapacity(worker) {
    return  (worker.properties.capacity || this.defaultCapacity) - this.workerLoad(worker);
  }

  workerLoad(worker) {
    return this.workerLoads[worker.id] || 0;
  }

  setWorkerLoad(worker, load) {
    this.workerLoads[worker.id] = load;
  }

  taskWeight(task) {
    return task.tasks && task.tasks.length || 1;
  }

  findMinCostTask(costMatrix, w, assignment) {
    var t = undefined, cost = Infinity;
    for (var k=0; k<costMatrix[w].length; k++) {
      if ((assignment[k] == undefined) && (costMatrix[w][k] < cost)) {
          cost = costMatrix[w][k];
          t = k;
      }
    }
    return t;
  }

  convertIdToIndex(id, items) {
    for (var i=0; i<items.length; i++) {
      if (items[i].id == id) {
        return i;
      }
    }
    return undefined;
  }

  assign(workers, tasks, initialAssignments) {

    let totalCost = 0; // TODO get initial cost
    let assignment = {}; // TODO get initial assignments { ...initialAssignments };
    let costHeap = this.costHeap(workers, tasks);

    console.log("Heap Size : " + costHeap.size());

    while (!costHeap.empty()) {

      let next = costHeap.pop();
      if (next.cost == Infinity) break;

      if (assignment[next.task.id] == undefined) {

        let weight = this.taskWeight(next.task);

        if (weight <= this.leftCapacity(next.worker)) {
          assignment[next.task.id] = next.worker.id;
          this.setWorkerLoad(next.worker, this.workerLoad(next.worker) + weight);
          totalCost += next.cost;
        }

      }

    }

    console.log("(Assignment) Done");
    return assignment;

  }

}
