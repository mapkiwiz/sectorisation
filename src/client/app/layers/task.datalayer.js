import Leaflet from 'leaflet';
import {DataLayer} from '../shared/components/leaflet/datalayer.component';
import '../shared/components/leaflet/label';

export class TaskLayer extends  DataLayer {

  get layerOptions() {
    return {

      pointToLayer: (feature, latLng) => {

        var icon = Leaflet.divIcon({
          className: 'task-marker',
          html: '<span class="glyphicon glyphicon-record"></span>',
          iconSize: Leaflet.point(30, 30),
          iconAnchor: Leaflet.point(16, 30)
        });

        return Leaflet.marker(latLng, {icon: icon});

      },

      onEachFeature: (feature, marker) => {

        //marker.bindLabel(feature.label, { direction: 'auto' });

        marker.on('click', () => {
          // popover.setContent('<p>' + feature.label + '</p>');
          // popover.setLatLng(marker.getLatLng());
          // if (!popover._map) popovers.addLayer(popover);

          this.context.store.dispatch({
            type: this.actionPrefix + 'SELECT_ONE',
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
