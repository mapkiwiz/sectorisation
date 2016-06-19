import React from 'react';
import {MenuLink} from './menu.link';
import {WorkersImportForm} from '../forms/workers.import.form';
import {parseFile} from '../shared/components/upload/file.helper';
import {DropZone} from '../shared/components/upload/dropzone.component';
import {BatchCommuneGeocoder} from '../services/static.commune.geocoder.service';
import {BatchPostcodeGeocoder} from '../services/static.postcode.geocoder.service';
import _ from 'lodash';

export class WorkersImportPanel extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object,
    router: React.PropTypes.object,
    messenger: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      file: undefined,
      headers: undefined,
      data: undefined,
      processing: false
    };
  }

  onDrop(file, data) {

    this.setState({
      file: undefined,
      headers: undefined,
      data: undefined,
      processing: false
    });

    parseFile(file, data, o => {
      if (_.isArray(o)) {
        let headers = _.keys(_.first(o));
        this.setState({
          file: file,
          data: o,
          headers: headers,
          processing: false
        });
      }
    });

  }

  itemToGeoJSON(id, label, geometry, properties) {
    return {
      type: 'Feature',
      id: id,
      label: label,
      properties: properties,
      geometry: geometry
    }
  }

  accept(params) {
    // geocode file/data
    // option 1. CODE INSEE -> COMMUNE CENTROID
    // option 2. CODE INSEE + COMMUNE -> BAN LOCATION
    // option 3. CODE POSTAL -> POSTOFFICE CENTROID
    // option 4. CODE POSTAL + COMMUNE -> BAN LOCATION
    // option 5. XY -> COMMUNE -> COMMUNE CENTROID
    switch (params.typeCodeCommune) {
      case 'insee':

        this.setState({
          ...this.state,
          processing: true
        });

        BatchCommuneGeocoder(this.state.file, this.state.data, params.communeInseeField,
          geocodedItems => {
            this.storeItems(geocodedItems, params);
          });

        return;

      case 'postcode':

        this.setState({
          ...this.state,
          processing: true
        });

        BatchPostcodeGeocoder(this.state.file, this.state.data, params.postcodeField,
          geocodedItems => {
            this.storeItems(geocodedItems, params);
          });

        return;

      default:
        this.context.messenger.setMessage('Géocodage par autre code indisponible', 'warning');
        this.context.router.push('/');
        return;

    } // end switch

  }

  storeItems(geocodedItems, params) {

    let items = geocodedItems.filter(item => item.location != undefined).map(
      item => {
        let id = item[params.idField];
        let label = item[params.labelField];
        let properties = _.omit(item, [ params.idField, params.labelField, 'location' ]);
        return this.itemToGeoJSON(id, label, item.location.geometry, properties);
      });

    this.context.store.dispatch({
      type: 'WORKER_SET_ITEMS',
      items: items
    });

    this.context.messenger.setMessage(
      items.length +  ' enquêteurs ont été importés', 'success');

    this.context.router.push('/');

  }

  render() {

    let content;
    if (this.state.processing) {
      content = (
        <div>
          <span  className="help-block">Importation en cours ...</span>
          <div className="progress">
            <div className="progress-bar progress-bar-success progress-bar-striped"
                 style={{ 'width': '100%' }}></div>
          </div>
        </div>
      );
    } else if (this.state.file) {
      content = (
        <WorkersImportForm file={ this.state.file }
                           headers={ this.state.headers }
                           onSubmit={ (params) => this.accept(params) }>
        </WorkersImportForm>
      );
    } else {
      content = (
        <div className="form-horizontal">
          <DropZone width="100%"
                    height="50px"
                    onDrop={ (file, data) => this.onDrop(file, data) } >
          </DropZone>
          <span className="help-block">
            Cliquer ou faites glisser un fichier sur cette zone
          </span>
        </div>
      )
    }

    return (
      <div className="col-md-6 col-md-offset-6 panel-container">
        <h3>
          Importer des enquêteurs
          <MenuLink></MenuLink>
        </h3>
        <hr/>
        { content }
      </div>
    );
  }

}
