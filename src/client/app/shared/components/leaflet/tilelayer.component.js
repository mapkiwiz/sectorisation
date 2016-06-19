import React from 'react';
import Leaflet from 'leaflet';
import _ from 'lodash';

export class TileLayer extends React.Component {

  __leaflet_component__;

  static contextTypes = {
    registry: React.PropTypes.object
  };

  static propTypes = {
    url: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    attribution: React.PropTypes.string,
    opacity: React.PropTypes.number,
    zIndex: React.PropTypes.number
  };

  static defaultProps = {
    opacity: 1.0
  };

  constructor(props, context) {
    super(props, context);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    let options = _.omit(this.props, [ 'url' ]);
    this.__leaflet_component__ = Leaflet.tileLayer(this.props.url, options);
    this.context.registry.addLayer(this.props.id, this.__leaflet_component__);
  }

  componentWillUnmount() {
    this.__leaflet_component__.remove();
    this.__leaflet_component__ = undefined;
  }

  render() {
    return null;
  }

}
