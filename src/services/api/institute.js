import config from "config";

export function createInstituteURL() {
  return `${config.apiUrl}/createInstitute`;
}

export function getListOfInstitutesURL() {
  return `${config.apiUrl}/listOfInstitutes`;
}

export function getInstituteURL() {
  return `${config.apiUrl}/getInstitute`;
}

export function DTInstituteUrl() {
  return `${config.apiUrl}/DTInstitute`;
}

export function deleteInstituteUrl() {
  return `${config.apiUrl}/deleteInstitute`;
}

export function updateInstituteUrl() {
  return `${config.apiUrl}/updateInstitute`;
}
