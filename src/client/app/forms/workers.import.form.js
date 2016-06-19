import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {guessField} from './utils';
import template from './workers.import.form.rt';

let WorkersImportForm = React.createClass({

  mixins: [ LinkedStateMixin ],

  propTypes: {
    'file': React.PropTypes.object,
    'headers': React.PropTypes.arrayOf(React.PropTypes.string),
    'onSubmit': React.PropTypes.func
  },

  supportedCRS: [
    { code: 4326, label: 'WGS84' },
    { code: 2154, label: 'IGNF/Lambert 93' }
  ],

  getInitialState: function() {
    return {
      idField: guessField(this.props.headers, /(id)|(us)|(enqtr)/i),
      labelField: guessField(this.props.headers, /(label)|(nom)/i),
      typeCodeCommune: 'insee',
      communeInseeField: guessField(this.props.headers, /(insee)/i),
      postcodeField: guessField(this.props.headers, /(post)/i),
      communeNameField: guessField(this.props.headers, /(com)|(nom)/i),
      hasLocation: false,
      crs: 4326,
      xField: guessField(this.props.headers, /(x)|(lon)/i),
      yField: guessField(this.props.headers, /(y)|(lat)/i)
    };
  },

  submit: function(e) {
    e.preventDefault();
    this.props.onSubmit(this.state);
  },

  render: function() {
    return template.call(this);
  }

});

export {WorkersImportForm};
