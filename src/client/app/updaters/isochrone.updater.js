import _ from 'lodash';
import {GPPIsochroneService} from '../services/gpp.isochrone.service';
import {config} from '../../config/index';

const distance = config.isochrone.distance;

export class IsochroneUpdater {

  store;
  dispose;
  dispatching = false;
  selection;
  isochrone_service;

  constructor(store) {
    this.store = store;
    this.isochrone_service = new GPPIsochroneService({
      url: config.gpp_isochrone_url,
      referer: config.gpp_referer,
      concavity: config.isochrone.concavity
    });
    this.dispose = store.subscribe(() => {
      let selection = _.first(this.store.getState().workers.selected);
      if (selection != this.selection) {
        this.selection = selection;
        this.selectIsochrone(this.findFeature(this.selection), distance);
      }
    });
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
        this.isochrone_service.fetch(feature, distance).then(result => {
          this.doAction({type: 'ISOCHRONE_STORE', key: feature.id, payload: result});
          this.doAction({type: 'ISOCHRONE_SELECT', key: feature.id});
        });
      }

      this.dispatching = false;

    }

  }

}
