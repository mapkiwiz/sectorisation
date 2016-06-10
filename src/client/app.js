import React from 'react';
import template from './map.rt';
import _ from 'lodash';
import parse from 'csv-parse';

function parseAsObject(data, options, callback) {
  parse(data, options, (err, out) => {
    let header = out.shift();
    callback(out.map(item => {
      return item.reduce((res, value, index) => {
        res[header[index]] = value;
        return res;
      }, {});
    }));
  });
}

export class App extends React.Component {

  static propTypes = {
    title: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    store: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = this.mapContextToState();
    this.filterByLabel = _.debounce(this.filterByLabel, 200);
  }

  mapContextToState() {
    return this.context.store.getState();
  }

  componentDidMount() {
    this.dispose =
      this.context.store.subscribe(() => {
        this.setState(this.mapContextToState());
      });
  }

  componentWillUnmount() {
    this.dispose();
  }

  doAction(action) {
    this.context.store.dispatch(action);
  }

  filter(e) {
    this.doAction({
      type: 'FILTER',
      filter: (item) => {
        return (item.id % 2) == 1;
      }
    });
    e.preventDefault();
  }

  searchItems(e) {
    e.persist();
    this.filterByLabel(e.target.value);
  }

  filterByLabel(query) {
    this.doAction({
      type: 'WORKER_FILTER',
      filter: (item) => {
        return item.label.toLowerCase().contains(query.toLowerCase());
      }
    });
  }

  unfilter(e) {
    this.doAction({
      type: 'WORKER_RESET_FILTER'
    });
    e.preventDefault();
    return false;
  }

  upload(file, data) {
    if (file.name.match(/\.csv$/)) {
      console.log('Upload CSV');
      parseAsObject(data, { comment: '#', delimiter: ',' }, o => console.log(o));
    } else if (file.name.match(/\.tsv$/)) {
      console.log('Upload TSV');
      parseAsObject(data, { comment: '#', delimiter: '\t' }, o => console.log(o));
    } else if (file.name.match(/\.geojson$/)) {
      console.log('Upload GeoJSON');
      console.log(JSON.parse(data));
    } else if (file.name.match(/\.json$/)) {
      console.log('Upload JSON');
      console.log(JSON.parse(data));
    } else {
      console.log('Upload unknown file type');
      // TODO Try CSV ?
    }
  }

  scroll(e, index) {
    this.doAction({
      type: 'SCROLL_TO',
      index: index
    });
    e.preventDefault();
    return false;
  }

  render() {
    return template.call(this);
  }

}
