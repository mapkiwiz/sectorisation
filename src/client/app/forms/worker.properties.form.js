import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import template from './worker.properties.form.rt';

let WorkerPropertiesForm = React.createClass({

  mixins: [ LinkedStateMixin ],

  propTypes: {
    'worker': React.PropTypes.object,
    'onSubmit': React.PropTypes.func
  },

  contextTypes: {
    store: React.PropTypes.object
  },

  getDefaultCapacity: function() {
    return this.context.store.getState().project.defaults['worker.capacity'];
  },

  getDefaultReach: function() {
    return this.context.store.getState().project.defaults['worker.reach'];
  },

  getInitialState: function() {
    let properties = this.props.worker.properties;
    return {
      id: this.props.worker.id,
      capacity: properties.capacity || this.getDefaultCapacity(),
      reach: properties.reach || this.getDefaultReach(),
      active: !!properties.active
    };
  },

  submit: function(e) {
    e.preventDefault();
    this.props.worker.properties = {
      ...this.props.worker.properties,
      capacity: (this.state.capacity == this.getDefaultCapacity()) ? undefined : this.state.capacity,
      reach: (this.state.reach == this.getDefaultReach()) ? undefined : this.state.reach,
      active: this.state.active
    };
    this.context.store.dispatch({
      type: 'ISOCHRONE_DELETE',
      key: this.props.worker.id
    });
    console.log(this.state);
    this.props.onSubmit(this.state);
  },

  render: function() {
    return template.call(this);
  }

});

export {WorkerPropertiesForm};
