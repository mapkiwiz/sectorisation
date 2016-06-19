import React from 'react';
import Leaflet from 'leaflet';
import {IsochroneUpdater} from '../updaters/isochrone.updater';

export class IsochroneLayer extends  React.Component {

  __leaflet_component__;
  dispose;
  updater;

  static propTypes = {
    id: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    store: React.PropTypes.object,
    registry: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = this.mapContextToState();
  }

  get layerOptions() {
    return {
      style: function(feature) {
        return {
          weight: 2,
          color: '#d00'
        };
      }
    };
  }

  mapContextToState() {
    let state = this.context.store.getState().isochrones;
    return { feature: state.items[state.selection ]};
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {

    this.__leaflet_component__ = Leaflet.geoJson(null, this.layerOptions);
    this.updateLayer();
    this.context.registry.addLayer(this.props.id, this.__leaflet_component__);
    this.dispose = this.context.store.subscribe(() => {
      let newState = this.mapContextToState();
      console.log(newState);
      if (newState.feature !== this.state.feature) {
        this.state = newState;
        this.updateLayer();
      }
    });

    this.updater = new IsochroneUpdater(this.context.store);

  }

  componentWillUnmount() {
    this.dispose();
    this.__leaflet_component__.remove();
    this.__leaflet_component__ = undefined;
    this.updater.dispose();
  }

  updateLayer() {
    let layer = this.__leaflet_component__;
    layer.clearLayers();
    if (this.state.feature)
      layer.addData(this.itemToGeoJSON(this.state.feature));
  }

  itemToGeoJSON(item) {
    return item;
  }

  render() {
    return null;
  }

}
