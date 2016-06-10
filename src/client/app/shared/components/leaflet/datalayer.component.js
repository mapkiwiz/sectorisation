import React from 'react';
import Leaflet from 'leaflet';
import {Popover} from '../../../../lib/Leaflet.popover/index';

export class DataLayer extends React.Component {

  __leaflet_component__;
  dispose;

  static propTypes = {
    id: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    store: React.PropTypes.object,
    registry: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    console.log(context);
    this.state = this.mapContextToState();
  }

  mapContextToState() {
    return {
      items: this.context.store.getState().visible_items
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    let popovers = Leaflet.layerGroup();
    let popover = new Popover({ direction: 'bottom', closeable: true });
    popover.setTitle('Enquêteur');
    let options = {
      pointToLayer: (feature, latLng) => {

        var icon = Leaflet.divIcon({
          className: 'feature-marker',
          html: '<span class="glyphicon glyphicon-map-marker"></span>',
          iconSize: Leaflet.point(30, 30),
          iconAnchor: Leaflet.point(16, 30)
        });

        return Leaflet.marker(latLng, {icon: icon});

      },
      onEachFeature: (feature, marker) => {
        marker.on('click', () => {
          // popover.setContent('<p>' + feature.label + '</p>');
          // popover.setLatLng(marker.getLatLng());
          // if (!popover._map) popovers.addLayer(popover);
          this.context.store.dispatch({
            type: 'SELECT_ONE',
            id: feature.id
          });
          this.context.store.dispatch({
            type: 'SCROLL_TO',
            index: feature.id
          });
        });
      }
    };
    this.__leaflet_component__ = Leaflet.geoJson(null, options);
    this.updateLayer();
    this.context.registry.addLayer(this.props.id, this.__leaflet_component__);
    this.context.registry.addLayer('popovers', popovers);
    this.dispose = this.context.store.subscribe(() => {
      let newState = this.mapContextToState();
      if (newState.items != this.state.items) {
        popover.close();
        this.state = newState;
        this.updateLayer();
      }
    });
  }

  componentWillUnmount() {
    this.dispose();
    this.__leaflet_component__.remove();
    this.__leaflet_component__ = undefined;
  }

  itemToGeoJSON(item) {
    return item;
  }

  updateLayer() {
    console.log('Update data layer ' + this.props.id);
    let layer = this.__leaflet_component__;
    console.log(layer);
    if (layer) {
      layer.clearLayers();
      this.state.items.forEach(item => {
        layer.addData(this.itemToGeoJSON(item));
      });
    }
  }

  render() {
    return null;
  }

}
