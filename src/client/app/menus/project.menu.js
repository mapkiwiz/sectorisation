import React from 'react';
import {Link} from 'react-router';
import {MenuLink} from '../panels/menu.link';
import {MessagePanel} from '../panels/message.panel';
import {saveProject, saveProjectAs, exportProject} from '../shared/project';

export class ProjectMenu extends React.Component {

  static contextTypes = {
    store: React.PropTypes.object,
    messenger: React.PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    this.state = { done: false };
  }

  doSaveProject(e) {
    e.preventDefault();
    let state = this.context.store.getState();
    saveProject(state);
    this.context.messenger.setMessage('Projet enregistré', 'success');
    this.setState({ done: true });
  }

  doExportProject(e) {
    e.preventDefault();
    exportProject(this.context.store.getState());
    this.context.messenger.setMessage('Projet exporté vers Orge', 'success');
    this.setState({ done: true });
  }

  doSaveAndCreateNewProject(e) {
    let state = this.context.store.getState();
    saveProject(state);
  }

  doSaveProjectAs(e) {
    e.preventDefault();
    let state = this.context.store.getState();
    saveProjectAs(state);
  }

  render() {
    return (
      <div className="col-md-4 col-md-offset-8 panel-container">
        <h3>
          Projet
          <MenuLink />
        </h3>
        <hr/>
        <MessagePanel />
        <ul className="list">
          <li><Link to="/project/open">Ouvrir un projet existant</Link></li>
          <li><a href="" onClick={ e => this.doSaveAndCreateNewProject(e) }>Nouveau projet</a></li>
          <li><a href="#" onClick={ e => this.doSaveProject(e) }>Enregistrer</a></li>
          <li><a href="#" onClick={ e => this.doSaveProjectAs(e) }>Enregistrer sous ...</a></li>
          <li><a href="#" onClick={ e => this.doExportProject(e) }>Exporter les affectations vers Orge</a></li>
          <li><Link to="/project/export/qgis">Exporter vers QGis</Link></li>
          <li><Link to="/project/properties">Propriétés du projet</Link></li>
        </ul>
      </div>
    );
  }

}
