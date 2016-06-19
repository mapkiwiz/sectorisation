import React from 'react';
import {Map} from './shared/components/leaflet/map.component';
import {TileLayer} from './shared/components/leaflet/tilelayer.component';
import stamen from '../layers/stamen.json';

export function MapContainer(props, context) {

  return (
    <Map id="map" className="full-screen-map" view={{ center: [46.1132, 6.4407], zoom: 9 }}>
      <TileLayer key={ stamen.id } {...stamen} ></TileLayer>
    </Map>
  );

}
