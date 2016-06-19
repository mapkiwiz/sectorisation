import React from 'react';
import {MenuLink} from './menu.link';
import {WorkersImportForm} from '../forms/workers.import.form';
import {parseFile} from '../shared/components/upload/file.helper';
import {DropZone} from '../shared/components/upload/dropzone.component';

export class WorkersImportPanel extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      file: undefined,
      headers: undefined,
      data: undefined
    };
  }

  onDrop(file, data) {

    this.setState({
      file: undefined,
      headers: undefined,
      data: undefined
    });

    parseFile(file, data, o => {
      if (_.isArray(o)) {
        let headers = _.keys(_.first(o));
        this.setState({
          file: file,
          data: o,
          headers: headers
        });
      }
    });

  }

  accept(params) {
    console.log(params);
  }

  render() {

    let content;
    if (this.state.file) {
      content = (
        <div className="form-horizontal">
          <WorkersImportForm file={ this.state.file }
                             headers={ this.state.headers }
                             onSubmit={ (params) => this.accept(params) }>
          </WorkersImportForm>
        </div>
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
      <div>
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
