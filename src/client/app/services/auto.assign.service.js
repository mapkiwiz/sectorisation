import {pointInPolygon} from '../../lib/geometry/pointInPolygon';
import Leaflet from 'leaflet';

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

    let aLatLng = Leaflet.latLng(a.coordinates[1], a.coordinates[0]);
    let bLatLng = Leaflet.latLng(b.coordinates[1], b.coordinates[0]);

    return aLatLng.distanceTo(bLatLng);

  }

  distanceMatrix(workers, tasks) {

    return workers.map(worker => {

      var accessiblePolygon = this.isochrone(worker);

      return tasks.map(task => {

        if (accessiblePolygon) {
          if (pointInPolygon(task.geometry, accessiblePolygon)) {
            return this.distance(worker.geometry, task.geometry);
          } else {
            return Infinity;
          }
        } else {
          return this.distance(worker.geometry, task.geometry);
        }

      });

    });

  }

  costMatrix(distanceMatrix, workers) {

   //  return distanceMatrix.map((row, w) => {
   //   return row.map(distance => {
   //     var capacity = this.leftCapacity(workers[w]);
   //     return this.assignmentCost(distance, capacity);
   //   });
   // });

    var matrix = [];

    for (var w=0; w<distanceMatrix.length; w++) {
      var row = [];
      var capacity = this.leftCapacity(workers[w]);
      for (var t=0; t<distanceMatrix[w].length; t++) {
        var cost = this.assignmentCost(distanceMatrix[w][t], capacity);
        row.push(cost);
      }
      matrix.push(row);
    }

    return matrix;

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

    var t,w;

    // 1. compute distance matrix and initial cost matrix
    console.log("Computing distance matrix");
    var distanceMatrix = this.distanceMatrix(workers, tasks);
    console.log("Computing cost matrix");
    var costMatrix = this.costMatrix(distanceMatrix, workers);

    // 2. optimize assignment

    // current iteration
    var k = 0;
    // assignment array by indices
    // task index -> worker index | undefined
    var assignment = [];

    for (t=0; t<tasks.length; t++) {
      let taskId = initialAssignments[tasks[t].id];
      w = assignment[t] = this.convertIdToIndex(taskId, tasks);
      if (w) {
        let weight = this.taskWeight(tasks[t]);
        this.setWorkerLoad(w, this.workerLoad(w) + weight);
      }
    }

    // a. find min cost assignment for each worker
    // b. compute differential cost of assignment
    // c. if random option greater than diff cost,
    //    swap assignment
    // d. repeat until cost is minimum or iterations are exhausted

    while (k < this.maxIteration) {

      for (w=0; w<workers.length; w++) {

        let minCostTask = this.findMinCostTask(costMatrix, w, assignment);

        if (minCostTask) {
          let previousWorker = assignment[minCostTask];
          let newCost = costMatrix[w][minCostTask];
          let previousCost = previousWorker ? costMatrix[previousWorker][minCostTask] : Infinity;
          let leftCapacity = this.leftCapacity(workers[w]);
          let weight = this.taskWeight(tasks[minCostTask]);

          if (newCost < previousCost) {
            if (weight <= leftCapacity) {
              assignment[minCostTask] = w;
              this.setWorkerLoad(workers[w], this.workerLoad(workers[w]) + weight);
              if (previousWorker) {
                this.setWorkerLoad(workers[previousWorker], this.workerLoad(workers[previousWorker]) - weight);
              }
            }
          }
        }

      }

      // next iteration
      k++;

    }

    console.log("Done");
    return assignment;

  }

}
