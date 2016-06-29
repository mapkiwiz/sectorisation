import React from 'react';
import {Promise} from 'bluebird';
import {MenuLink} from './menu.link';
import {MessagePanel} from '../panels/message.panel';
import {config} from '../../config/index';

export class IsochroneLoadingPanel extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object,
    messenger: React.PropTypes.object
  };

  isochrone_service;

  constructor(props, context) {

    super(props, context);
    this.state = {
      progress: 0
    };

    this.isochrone_service = config['IsochroneService'];

  }

  get defaultReach() {
    return this.context.store.getState().project.defaults['worker.reach'];
  }

  get progress() {
    let isochrones = Object.keys(this.context.store.getState().isochrones.items).length;
    let objects = this.context.store.getState().workers.items.length;
    if (objects > 0) {
      return 100 * isochrones / objects;
    } else {
      return 100;
    }
  }

  componentDidMount() {
    this.run();
  }

  doAction(action) {
    this.context.store.dispatch(action);
  }

  isochroneIsAlreadyFetched(worker) {
    return this.context.store.getState().isochrones.items.hasOwnProperty(worker.id);
  }

  run() {

    this.setState({ progress: 0 });
    let workers = this.context.store.getState().workers.items;
    let promises = workers.map(worker => {
      if (this.isochroneIsAlreadyFetched(worker)) {
        this.setState({ progress: this.progress });
        return Promise.resolve();
      } else {
        let distance = worker.properties.reach || this.defaultReach;
        return this.isochrone_service.fetch(worker, distance).then(isochrone => {
          this.setState({ progress: this.progress });
          this.doAction({type: 'ISOCHRONE_STORE', key: worker.id, payload: isochrone});
        });
      }
    });

    Promise.all(promises).then(() => {
      this.context.messenger.setMessage('Calcul des isochrones terminé', 'success');
      this.setState({ progress: 100 });
    });

  }

  render() {

    let progressBar;
    if (this.state.progress > 0 && this.progress < 100) {
      progressBar = (
        <div>
          <div className="alert alert-info">
            Calcul des isochrones en cours ...
          </div>
          <div className="progress">
            <div className="progress-bar progress-bar-success progress-bar-striped"
                 style={{ 'width': this.state.progress + '%' }}></div>
          </div>
        </div>
      );
    } else {
      progressBar = (
        <MessagePanel />
      );
    }

    return (
      <div className="col-md-4 col-md-offset-8 panel-container">
        <h3>
          Isochrones
          <MenuLink />
        </h3>
        <hr/>
        { progressBar }
      </div>
    );
  }

}
