import LZString from 'lz-string';
import slug from 'slug/slug-browser';

export function generateUniqueProjectId() {

  let projectList = getProjects();
  let uniqueId;

  do {
    uniqueId = getRandomString(8);
  } while (projectList.hasOwnProperty(uniqueId));

  return uniqueId;

}

export function getRandomString(length) {

  let result = '';
  let choices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i=0; i < length; i++ )
    result += choices.charAt(Math.floor(Math.random() * choices.length));

  return result;

}

export function getProjects() {
  let projectList = window.localStorage.getItem('sectorisation.projects');
  if (projectList) {
    return JSON.parse(projectList);
  } else {
    return {};
  }
}

export function loadProject(projectId) {
  if (projectId) {
    let projectData = window.localStorage.getItem(projectId);
    if (projectData) {
      return JSON.parse(LZString.decompressFromUTF16(projectData));
    }
  }
  return undefined;
}

export function saveProject(state) {
  let projectData = LZString.compressToUTF16(JSON.stringify(state));
  window.localStorage.setItem(state.project.id, projectData);
  let projectList = getProjects();
  projectList[state.project.id] = {
    id: state.project.id,
    title: state.project.title,
    description: state.project.description
  };
  window.localStorage.setItem('sectorisation.projects', JSON.stringify(projectList));
}

export function saveProjectAs(state) {
  let projectData = LZString.compressToUTF16(JSON.stringify(state));
  triggerDownload(
    projectData,
    slug(state.project.title || 'Sans titre') + '-' + state.project.id + '.projet',
    'application/vnd.sectorisation.project');
}

export function removeProject(projectId) {
  let projectList = getProjects();
  if (projectList.hasOwnProperty(projectId)) {
    delete projectList[projectId];
    window.localStorage.setItem('sectorisation.projects', JSON.stringify(projectList));
  }
}

export function exportProject() {}

function triggerDownload(data, filename, mimeType) {

  let blob = new Blob([ data ], {
    type: mimeType
  });

  if (window.navigator.msSaveOrOpenBlob) {

    window.navigator.msSaveBlob(blob, filename);

  } else {

    let downloadLink = document.createElement("a");
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

  }

}
