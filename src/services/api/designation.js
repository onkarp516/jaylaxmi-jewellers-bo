import config from "config";

export function createDesignationUrl() {
  return `${config.apiUrl}/createDesignation`;
}
export function DTDesignationUrl() {
  return `${config.apiUrl}/DTDesignation`;
}
export function updateDesignationUrl() {
  return `${config.apiUrl}/updateDesignation`;
}

export function deleteDesignationUrl() {
  return `${config.apiUrl}/deleteDesignation`;
}

export function findDesignationUrl() {
  return `${config.apiUrl}/findDesignation`;
}

export function listOfDesignationUrl() {
  return `${config.apiUrl}/listOfDesignation`;
}
export function getAllExportURL() {
  return `${config.apiUrl}/export/excel`;
  }
