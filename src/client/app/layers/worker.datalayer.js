import Leaflet from 'leaflet';
import {DataLayer} from '../shared/components/leaflet/datalayer.component';
import '../shared/components/leaflet/label';

export class WorkerLayer extends  DataLayer {

  workerCapacity(worker) {
    return worker.properties.capacity || this.state.defaultCapacity;
  }

  getMarkerClassName(feature) {
    if (this.state.selected.includes(feature.id)) {
      return 'worker-selected';
    } else if (!feature.properties.active) {
      return 'worker-inactive';
    } else {
      let workers = this.context.store.getState().assignments.workers;
      let taskload = workers[feature.id] || 0;
      if (taskload == 0) {
        return 'worker-untasked';
      } else if (taskload < 0.5*this.workerCapacity(feature)) {
        return 'worker-low-tasked';
      } else if (taskload < 0.8*this.workerCapacity(feature)) {
        return 'worker-medium-tasked';
      } else if (taskload > this.workerCapacity(feature)) {
        return 'worker-over-tasked';
      } else {
        return 'worker-fully-tasked';
      }
    }
  }

  setMarkerStyle(marker) {
    if (marker._icon) {
      [
        'worker-selected',
        'worker-inactive',
        'worker-untasked',
        'worker-low-tasked',
        'worker-medium-tasked',
        'worker-over-tasked',
        'worker-fully-tasked'
      ].forEach(className => {
        marker._icon.classList.remove(className);
      });
      marker._icon.classList.add(this.getMarkerClassName(marker.feature));
    }
  }

  get layerOptions() {
    return {
      pointToLayer: (feature, latLng) => {

        var icon = Leaflet.divIcon({
          className: 'worker-marker',
          html: '<span class="glyphicon glyphicon-map-marker"></span>',
          iconSize: Leaflet.point(30, 30),
          iconAnchor: Leaflet.point(16, 30)
        });

        return Leaflet.marker(latLng, {icon: icon});

      },
      onEachFeature: (feature, marker) => {
        marker.bindLabel(feature.label, { direction: 'auto' });
        marker.on('click', () => {
          // popover.setContent('<p>' + feature.label + '</p>');
          // popover.setLatLng(marker.getLatLng());
          // if (!popover._map) popovers.addLayer(popover);

          this.context.store.dispatch({
            type: this.actionPrefix + 'TOGGLE_ONE',
            id: feature.id
          });

          this.context.store.dispatch({
            type: this.actionPrefix + 'SCROLL_TO',
            index: feature.id
          });

        });
      }
    };
  }

}
