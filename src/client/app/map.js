import React from 'react';
import {Map} from './shared/components/leaflet/map.component';
import {TileLayer} from './shared/components/leaflet/tilelayer.component';
import {WorkerLayer} from './layers/worker.datalayer';
import {TaskGroupLayer} from './layers/taskgroup.datalayer';
import {IsochroneLayer} from './layers/isochrone.datalayer';
import stamen from '../layers/stamen.json';

export function MapContainer(props, context) {

  return (
    <Map id="map" className="full-screen-map" view={{ center: [46.1132, 6.4407], zoom: 9 }}>
      <TileLayer key={ stamen.id } {...stamen} ></TileLayer>
      <TaskGroupLayer key="groups-layer"
                      id="groups"
                      actionPrefix="GROUP_"
                      mapState={ state => ({ items: state.groups.visible_items, selected: state.groups.selected }) } >
      </TaskGroupLayer>
      <IsochroneLayer key="isochrone-layer"
                      id="isochrone">
      </IsochroneLayer>
      <WorkerLayer key="workers-layer"
                   id="workers"
                   actionPrefix="WORKER_"
                   selectedClassName="worker-selected"
                   mapState={ state => ({ items: state.workers.visible_items, selected: state.workers.selected }) }>
      </WorkerLayer>
    </Map>
  );

}
