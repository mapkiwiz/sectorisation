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
    // console.log("Did mount TaskGroupLayer");
  }

  getLabelClassName(feature) {
    // TODO legend partially assigned taskgroups
    if (this.state.selected.includes(feature.id)) {
      return 'taskgroup-assigned-selected';
    } else {
      let groups = this.context.store.getState().assignments.groups;
      if (groups[feature.id]) {
        return 'taskgroup-assigned';
      } else {
        return 'taskgroup-unassigned';
      }
    }
  }

  setMarkerStyle(marker) {
     if (marker._icon) {
       [
         'taskgroup-unassigned',
         'taskgroup-assigned',
         'taskgroup-assigned-selected',
         'taskgroup-partially-assigned'
       ].forEach(className => {
         marker._icon.classList.remove(className);
       });
       marker._icon.classList.add(this.getLabelClassName(marker.feature));
     }
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

        function toggleLabel(mapEvent) {
          let zoom = mapEvent.target.getZoom();
          if (zoom > 9) {
            marker._icon.classList.add('high-zoom');
          } else {
            marker._icon.classList.remove('high-zoom');
          }
        }

        marker.on('add', function(markerEvent) {
          markerEvent.target._map.on('zoomend', toggleLabel);
        });

        marker.on('remove', function(markerEvent) {
          markerEvent.target._map.off('zoomend', toggleLabel);
        });

        // marker.bindLabel(feature.label, {
        //   direction: 'auto',
        //   className: 'commune-label'
        // });

        marker.on('click', () => {

          this.context.store.dispatch({
            type: this.actionPrefix + 'TOGGLE_ASSIGN',
            group: feature,
            tasks: feature.tasks
          });


          this.context.store.dispatch({
             type: this.actionPrefix + 'TOGGLE',
             id: feature.id
          });

          // this.context.store.dispatch({
          //   type: this.actionPrefix + 'SCROLL_TO',
          //   index: feature.id
          // });

        });

        marker.on('contextmenu', (e) => {
          e.originalEvent.preventDefault();
          this.popover.setTitle(feature.label);
          this.popover.setContent('<p><span class="badge">' + feature.tasks.length + '</span> <a href="#" data-group-id="' + feature.id + '" onClick="L.Popover.doContextAction(arguments[0])">Unités statistiques</a></p>');
          this.popover.setLatLng(marker.getLatLng());
          if (!this.popover._map) this.popovers.addLayer(this.popover);
        });

      }

    };
  }

}

Leaflet.Popover.doContextAction = function(e) {
  e.preventDefault();
  console.log('GroupId -> ' + e.target.dataset.groupId);
};
