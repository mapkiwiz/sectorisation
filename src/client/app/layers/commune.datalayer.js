import {DataLayer} from '../shared/components/leaflet/datalayer.component';
import L from 'leaflet';
import '../shared/components/leaflet/label';

export class CommuneLayer extends  DataLayer {

  get layerOptions() {
    return {

      style: feature => this.styleOf(feature),

      onEachFeature: (feature, marker) => {

        marker.bindLabel(feature.label + ' <span class="badge">18</span>', { direction: 'auto', className: 'commune-label'});

        // marker.on('add', (e) => {
        //   let label = new L.Label();
        //   label.setContent(feature.label);
        //   label.setLatLng(marker.getBounds().getCenter());
        //   e.target._map.showLabel(label);
        // });

        marker.on('click', () => {
          // popover.setContent('<p>' + feature.label + '</p>');
          // popover.setLatLng(marker.getLatLng());
          // if (!popover._map) popovers.addLayer(popover);

          feature.properties.assigned = !feature.properties.assigned;

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

  styleOf(feature) {

    if (this.state.selected.includes(feature.id)) {
      return {
        weight: 2,
        color: '#0d0'
      };
    } else if (feature.properties.assigned) {
      return {
        weight: 2,
        color: '#0d0'
      };
    } else {
      return {
        weight: 2,
        color: '#03f'
      };
    }

  }

}
