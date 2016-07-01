import React from 'react';
import {Promise} from 'bluebird';
import {MenuLink} from './menu.link';
import {MessagePanel} from '../panels/message.panel';
import {config} from '../../config/index';
import Queue from 'queue';
import _ from 'lodash';

export class IsochroneLoadingPanel extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object,
    messenger: React.PropTypes.object,
    router: React.PropTypes.object
  };

  isochrone_service;

  constructor(props, context) {

    super(props, context);
    this.state = {
      progress: 0,
      done: false
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

  retry(e) {
    e.preventDefault();
    this.run();
  }

  dismiss(e) {
    e.preventDefault();
    this.context.router.push('/assign');
  }

  run() {

    this.setState({ progress: 0, done: false });

    let queue = new Queue();
    queue.concurrency = config.isochrone.concurrency;
    queue.timeout = config.isochrone.timeout;
    queue.on('timeout', (next) => {
      next();
    });

    let workers = this.context.store.getState().workers.items;

    workers.map(worker => {
      queue.push((cb) => {
          if (this.isochroneIsAlreadyFetched(worker)) {

            this.setState({ ...this.state, progress: this.progress });
            cb();

          } else {

            let distance = worker.properties.reach || this.defaultReach;
            let job = this.isochrone_service.fetch(worker, distance).then(isochrone => {
              this.setState({ ...this.state, progress: this.progress });
              this.doAction({type: 'ISOCHRONE_STORE', key: worker.id, payload: isochrone});
            }).then(cb);

            new Promise((resolve, reject) => {
              setTimeout(() => reject(new Error('Timeout')), queue.timeout);
              job.then(resolve, reject);
            }).catch(err => {
              if (_.isFunction(job.cancel)) {
                job.cancel();
              } else if (_.isFunction(job.abort)) {
                job.abort();
              }
              cb(err);
            });

          }
      });
    });

    queue.start((err) => {
      if (err || this.progress < 100) {
        this.context.messenger.setMessage('Certaines isochrones n\'ont pas pu être récupérées', 'warning');
        this.setState({ progress: this.progress, done: true });
      } else {
        this.context.messenger.setMessage('Calcul des isochrones terminé', 'success');
        this.setState({ progress: 100, done: true });
      }
    });

  }

  render() {

    let panelContent;
    if (this.state.done) {
      if (this.progress < 100) {
        panelContent = (
          <div>
            <MessagePanel />
            <button className="btn btn-default pull-right"
                    onClick={ e => this.retry(e) }>Reprendre</button>
          </div>
        );
      } else {
        panelContent = (
          <div>
            <MessagePanel />
            <button className="btn btn-success pull-right"
                    onClick={ e => this.dismiss(e) }>Ok</button>
          </div>
        );
      }
    } else {
      panelContent = (
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
    }

    return (
      <div className="col-md-4 col-md-offset-8 panel-container">
        <h3>
          Isochrones
          <MenuLink />
        </h3>
        <hr/>
        { panelContent }
      </div>
    );
  }

}
