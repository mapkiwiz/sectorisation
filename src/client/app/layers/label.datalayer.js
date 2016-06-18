import Leaflet from 'leaflet';
import {DataLayer} from '../shared/components/leaflet/datalayer.component';
import '../shared/components/leaflet/label';

export class LabelLayer extends  DataLayer {

  get layerOptions() {
    return {

      pointToLayer: (feature, latLng) => {

        var icon = Leaflet.divIcon({
          className: 'commune-label',
          html: '<span class="badge">18</span><span class="details">' + feature.label + '</span>'
        });

        return Leaflet.marker(latLng, {icon: icon});

      },

      onEachFeature: (feature, marker) => {

        marker.on('add', function(markerEvent) {
          markerEvent.target._map.on('zoomend', function(mapEvent) {
            let zoom = mapEvent.target.getZoom();
            if (zoom > 10) {
              marker._icon.classList.add('high-zoom');
            } else {
              marker._icon.classList.remove('high-zoom');
            }
          });
        });

        // marker.bindLabel(feature.label, {
        //   direction: 'auto',
        //   className: 'commune-label'
        // });

        marker.on('click', () => {
          // popover.setContent('<p>' + feature.label + '</p>');
          // popover.setLatLng(marker.getLatLng());
          // if (!popover._map) popovers.addLayer(popover);

          this.context.store.dispatch({
            type: this.actionPrefix + 'SELECT',
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
