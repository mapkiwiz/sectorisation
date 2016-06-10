import React from 'react';
import Leaflet from 'leaflet';

Leaflet.Icon.Default.imagePath = 'images';

export class LayerRegistry {

  map;
  layers = {};
  order = [];

  addLayer(key, layer) {
    this.layers[key] = layer;
    this.order.push(key);
  }

  addTo(map) {
    this.map = map;
    this.order.forEach(key => {
      console.log(key);
      this.map.addLayer(this.layers[key]);
    });
  }

}

export class Map extends React.Component {

  map;

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    view: React.PropTypes.shape({
        center: React.PropTypes.arrayOf(React.PropTypes.number),
        zoom: React.PropTypes.number
      }).isRequired
  };

  static childContextTypes = {
    registry: React.PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      view: this.props.view
    };
    this.registry = new LayerRegistry();
  }

  getChildContext() {
    return {
      registry: this.registry
    };
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.map = Leaflet.map(this.props.id).setView(this.state.view.center, this.state.view.zoom);
    this.registry.addTo(this.map);
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return (
      <div id={ this.props.id } className={ this.props.className } >
        { this.props.children }
      </div>
    );
  }

}
