import React from 'react';
import {MenuLink} from './menu.link';
import {MessagePanel} from './message.panel';
import {WorkerPropertiesForm} from '../forms/worker.properties.form';
import _ from 'lodash';

export class WorkerDetailsPanel extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object,
    messenger: React.PropTypes.object,
    router: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      workerId: this.getWorkerId()
    };
  }

  save(state) {
    console.log('Save ...');
    this.context.messenger.setMessage('Enquêteur modifié', 'success');
    this.setState({
      workerId: this.getWorkerId()
    });
  }

  componentDidMount() {
    this.dispose = this.context.store.subscribe(() => {
      let selectedWorkerId = _.first(this.context.store.getState().workers.selected);
      if (selectedWorkerId != this.state.workerId) {
        this.context.router.push('/workers');
        this.context.router.push('/worker/' + selectedWorkerId + '/details');
      }
    });
  }

  componentWillUnmount() {
    this.dispose();
  }

  getWorkerId() {
    let path = window.location.toString().match(/\/worker\/(\d+)\/details$/);
    return +path[1];
  }

  render() {

    let workerId = this.state.workerId;
    let worker = _.find(this.context.store.getState().workers.items, o => (o.id == workerId));
    let properties = _.chain(worker.properties).omit([
      // 'active',
      // 'capacity',
      // 'reach'
    ]).flatMap((value, key) => {
      return (
        <tr key={ key }>
          <td>{ key }</td>
          <td>{ value }</td>
        </tr>
      );
    }).value();

    return (
      <div className="col-md-4 col-md-offset-8 panel-container">
        <h3>
          Détail de l'enquêteur
          <MenuLink to="/workers" />
        </h3>
        <hr/>
        <MessagePanel />
        <h4>
          { worker.label }
          <span className="pull-right" style={{ 'color': 'lightgrey' }}># {workerId}</span>
        </h4>
        <table className="table table-striped table-bordered">
          <tbody>
          { properties }
          </tbody>
        </table>
        <WorkerPropertiesForm worker={ worker }
                              onSubmit={ (state) => this.save(state) }>
        </WorkerPropertiesForm>
      </div>
    );

  }

}
