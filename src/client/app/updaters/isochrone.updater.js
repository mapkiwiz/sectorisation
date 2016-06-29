import _ from 'lodash';
import {config} from '../../config/index';

export class IsochroneUpdater {

  store;
  dispose;
  dispatching = false;
  selection;
  isochrone_service;

  constructor(store) {
    this.store = store;
    this.isochrone_service = config['IsochroneService'];
    this.dispose = store.subscribe(() => {
      let selection = _.first(this.store.getState().workers.selected);
      if (selection != this.selection) {
          this.selectIsochrone(this.findFeature(selection), 0);
      }
    });
  }

  get defaultReach() {
    return this.store.getState().project.defaults['worker.reach'];
  }

  doAction(action) {
    this.store.dispatch(action);
  }

  findFeature(key) {
    if (!key) return undefined;
    let features = this.store.getState().workers.items;
    return _.find(features, o => ( o.id == key ));
  }

  selectIsochrone(feature, distance) {

    console.log('SelectIsochrone');
    console.log(feature);

    if (!this.dispatching) {

      this.dispatching = true;

      if (!feature) {
        this.doAction({type: 'ISOCHRONE_UNSELECT'});
        return;
      }

      let isochrones = this.store.getState().isochrones.items;
      if (_.has(isochrones, feature.id)) {
        this.doAction({type: 'ISOCHRONE_SELECT', key: feature.id});
      } else {
        let distance = feature.properties.reach || this.defaultReach;
        console.log('Distance -> ' + distance);
        this.isochrone_service.fetch(feature, distance).then(result => {
          this.doAction({type: 'ISOCHRONE_STORE', key: feature.id, payload: result});
          this.doAction({type: 'ISOCHRONE_SELECT', key: feature.id});
        });
      }

      this.dispatching = false;

    }

  }

}
