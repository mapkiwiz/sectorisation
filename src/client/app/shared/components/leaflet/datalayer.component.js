import React from 'react';
import Leaflet from 'leaflet';
import {Popover} from '../../../../lib/Leaflet.popover/index';

export class DataLayer extends React.Component {

  __leaflet_component__;
  dispose;

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    actionPrefix: React.PropTypes.string,
    mapState: React.PropTypes.func
  };

  static defaultProps = {
    actionPrefix: '',
    mapState: state => ({
      items: state.visible_items,
      selected: state.selected
    })
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

  get actionPrefix() {
    return this.props.actionPrefix;
  }

  get layerOptions() {
    return {};
  }

  mapContextToState() {
    return this.props.mapState(this.context.store.getState());
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    // let popovers = Leaflet.layerGroup();
    // let popover = new Popover({ direction: 'bottom', closeable: true });
    // popover.setTitle('Enquêteur');

    this.__leaflet_component__ = Leaflet.geoJson(null, this.layerOptions);
    this.updateLayer();
    this.context.registry.addLayer(this.props.id, this.__leaflet_component__);
    // this.context.registry.addLayer('popovers', popovers);
    this.dispose = this.context.store.subscribe(() => {
      let newState = this.mapContextToState();
      if (newState.items != this.state.items) {
        this.state = newState;
        this.updateLayer();
      }
      if (newState.selected != this.state.selected) {
        this.state = newState;
        this.updateSelection();
      }
    });
  }

  updateSelection() {
    Object.keys(this.__leaflet_component__._layers).forEach(key => {
      let marker = this.__leaflet_component__._layers[key];
      if (this.state.selected.includes(marker.feature.id)) {
        marker._icon.classList.add('feature-marker-selected');
      } else {
        marker._icon.classList.remove('feature-marker-selected');
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
    if (layer) {
      layer.clearLayers();
      this.state.items.forEach(item => {
        layer.addData(this.itemToGeoJSON(item));
      });
      this.updateSelection();
    }
  }

  render() {
    return null;
  }

}
