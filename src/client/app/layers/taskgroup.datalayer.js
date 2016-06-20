import Leaflet from 'leaflet';
import {DataLayer} from '../shared/components/leaflet/datalayer.component';
import '../shared/components/leaflet/label';
import {Popover} from '../../lib/Leaflet.popover/index';
import _ from 'lodash';

export class TaskGroupLayer extends  DataLayer {

  popovers;
  popover;

  componentDidMount() {
    super.componentDidMount();
    this.popovers = Leaflet.layerGroup();
    this.popover = new Popover({
      direction: 'right',
      closeable: true,
      offset: {
        left: 8,
        right: 15,
        top: 5,
        bottom: 0 }
    });
    this.context.registry.addLayer('popovers', this.popovers);
  }

  get layerOptions() {
    return {

      pointToLayer: (feature, latLng) => {

        var icon = Leaflet.divIcon({
          className: 'commune-label',
          html: '<span class="badge">' + (feature.weight || 0) +
          '</span><span class="details">' + feature.label + '</span>'
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

          this.context.store.dispatch({
            type: this.actionPrefix + 'ASSIGN_TO_SELECTED_WORKER',
            group: feature.id,
            tasks: feature.tasks
          });

          // this.context.store.dispatch({
          //   type: this.actionPrefix + 'SCROLL_TO',
          //   index: feature.id
          // });

        });

        marker.on('contextmenu', (e) => {
          e.originalEvent.preventDefault();
          this.popover.setTitle(feature.label);
          this.popover.setContent('<p>...</p>');
          this.popover.setLatLng(marker.getLatLng());
          if (!this.popover._map) this.popovers.addLayer(this.popover);
        });

      }

    };
  }

}
