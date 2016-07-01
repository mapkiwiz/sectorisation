import {pointInPolygon} from '../../lib/geometry/pointInPolygon';
import Leaflet from 'leaflet';

export class AutoAssignService {

  store;
  state;
  maxIteration;
  workerLoads;

  constructor(store) {

    this.store = store;
    this.state = store.getState();
    this.minAssignedCapacity = 2;
    this.defaultCapacity = this.state.project.defaults['worker.capacity'];
    this.maxIteration = 20;
    this.workerLoads = {};

  }

  isochrone(worker) {
    return this.store.getState().isochrones.items[worker.id];
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

    var matrix = [];

    for (var w=0; w<distanceMatrix.length; w++) {
      var row = [];
      var capacity = this.leftCapacity(workers[w]);
      for (var t=0; t<distanceMatrix[w].length; t++) {
        var cost = this.costNewlyAssigned(distanceMatrix, w, t, capacity);
        row.push(cost);
      }

      matrix.push(row);
    }

    return matrix;

  }

  costAlreadyAssigned(distanceMatrix, w, t, capacity) {

    if (capacity <= 0) {
      return Math.pow(distanceMatrix[w][t], 2) / this.minAssignedCapacity;
    } else {
      return Math.pow(distanceMatrix[w][t], 2) / (1.1*capacity);
    }

  }

  costNewlyAssigned(distanceMatrix, w, t, capacity) {

    if (capacity <= 0) {
      return Infinity;
    } else {
      return Math.pow(distanceMatrix[w][t], 2) / capacity;
    }

  }

  leftCapacity(worker) {
    return  (worker.properties.capacity || this.defaultCapacity) - this.workerLoad(worker);
  }

  workerLoad(worker) {
    return this.workerLoads[worker.id] || this.state.assignments.workers[worker.id] || 0;
  }

  setWorkerLoad(worker, load) {
    this.workerLoads[worker.id] = load;
  }

  taskWeight(task) {
    return task.tasks && task.tasks.length || 1;
  }

  assign() {

    var t,w;
    let workers = this.state.workers.items;
    let tasks = this.state.groups.items;

    // 1. compute distance matrix and initial cost matrix
    console.log("Computing distance matrix");
    var distanceMatrix = this.distanceMatrix(workers, tasks);
    console.log("Computing cost matrix");
    var costMatrix = this.costMatrix(distanceMatrix, workers);

    // 2. optimize assignment

    // current iteration
    var k = 0;
    var assignment = [];

    for (t=0; t<tasks.length; t++) {
      assignment[t] = undefined;
    }

    while (k < this.maxIteration) {

      console.log("Iteration " + k);
      var changed = 0;
      var selectedWorker;

      // iterate over tasks
      for (t=0; t<tasks.length; t++) {

        var minCost = Infinity;
        selectedWorker = undefined;

        // find worker with min cost for task t
        for (w=0; w<workers.length; w++) {
          var cost = costMatrix[w][t];
          if (cost < minCost) {
            minCost = cost;
            selectedWorker = w;
          }
        }

        if (selectedWorker !== undefined) {

          var previousWorker = assignment[t];

          if (selectedWorker !== previousWorker) {

            changed++;
            assignment[t] = selectedWorker;

            this.setWorkerLoad(
              workers[selectedWorker],
              this.workerLoad(workers[selectedWorker]) + this.taskWeight(tasks[t])
            );

            if (previousWorker !== undefined) {
              this.setWorkerLoad(
                workers[previousWorker],
                this.workerLoad(workers[previousWorker]) - this.taskWeight(tasks[t])
              );
            }

            // update cost matrix
            for (var kt=0; kt<tasks.length; kt++) {

              if (previousWorker !== undefined) {
                costMatrix[previousWorker][kt] = this.costNewlyAssigned(
                  distanceMatrix,
                  previousWorker,
                  kt,
                  this.leftCapacity(workers[previousWorker]));
              }

              costMatrix[selectedWorker][kt] = this.costAlreadyAssigned(
                distanceMatrix,
                selectedWorker,
                kt,
                this.leftCapacity(workers[selectedWorker]));

            }

          }

        }

      } // end iterate over tasks

      if (changed === 0) {
        break;
      }

      // next iteration
      k++;

    }

    console.log("Done");
    return assignment;

  }

}
